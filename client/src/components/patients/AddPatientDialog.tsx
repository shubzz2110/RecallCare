import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Label } from "../ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { CheckCircle2, Phone, Plus, User2, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { errorHandler } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Patient } from "@/types/types";
import ScheduleAppointmentModal from "./ScheduleAppointmentModal";
import AddVisitModal from "./AddVisitModal";

interface AddPatientDialogProps {
  showDialog: boolean;
  onCloseDialog: (show: boolean) => void;
}

type LookupState = "idle" | "checking" | "exists" | "new";

interface PatientLookUp {
  _id: string;
  name: string;
  phone: string;
}

export default function AddPatientDialog({
  showDialog,
  onCloseDialog,
}: AddPatientDialogProps) {
  const [lookupState, setLookupState] = useState<LookupState>("idle");
  const [existingPatient, setExistingPatient] = useState<PatientLookUp | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [showCreatePatientForm, setShowCreatePatientForm] = useState(false);
  const [newPatientCreated, setNewPatientCreated] = useState<Patient | null>(
    null,
  );
  const [showScheduleAppointmentModal, setShowScheduleAppointmentModal] =
    useState<boolean>(false);
  const [showAddVisitModal, setShowAddVisitModal] = useState<boolean>(false);

  const AddPatientSchema = Yup.object({
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10 digit mobile number")
      .required("Mobile number is required"),

    name: Yup.string().test(
      "required-if-new",
      "Patient name is required",
      function (value) {
        if (lookupState === "new" && !value) return false;
        return true;
      },
    ),

    notes: Yup.string().max(200, "Too long"),
  });

  const formik = useFormik({
    initialValues: {
      phone: "",
      name: "",
      notes: "",
    },
    validationSchema: AddPatientSchema,
    onSubmit: (values) => handleAddNewPatient(values),
  });
  const handleAddNewPatient = async (values: {
    phone: string;
    name: string;
    notes?: string;
  }) => {
    try {
      const response = await api.post<{
        success: boolean;
        message?: string;
        patient: Patient;
      }>("/patients", {
        phone: values.phone,
        name: values.name,
        notes: values.notes,
      });
      if (response && response.data) {
        setNewPatientCreated(response.data.patient);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const phone = formik.values.phone;

    if (phone.length !== 10) {
      setLookupState("idle");
      setExistingPatient(null);
      return;
    }

    let cancelled = false;

    setLookupState("checking");
    const timer = setTimeout(async () => {
      if (cancelled) return;

      try {
        const response = await api.get<{
          success: boolean;
          patient: PatientLookUp;
        }>("/patients/search-patient", { params: { phone } });

        if (cancelled) return; // phone changed while request was in-flight

        if (response?.data.success && response.data.patient) {
          setLookupState("exists");
          setExistingPatient(response.data.patient);
        } else {
          setLookupState("new");
          setExistingPatient(null);
        }
      } catch (error) {
        if (!cancelled) {
          errorHandler(error);
          setLookupState("idle");
        }
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [formik.values.phone]);

  return (
    <Dialog
      open={showDialog}
      onOpenChange={() => {
        formik.resetForm();
        onCloseDialog(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Patient</DialogTitle>
          <DialogDescription>Search or create patient</DialogDescription>
        </DialogHeader>
        {newPatientCreated ? (
          <div className="flex items-center justify-center py-5 mx-auto w-xs">
            <div className="flex items-center flex-col space-y-5">
              <CheckCircle2 size={100} stroke="green" strokeWidth={1} />
              <p className="text-foreground font-medium text-base text-center">
                Patient <b>{newPatientCreated.name}</b> has been registered
                successfully
              </p>
              <Button type="button">Add Visit</Button>
            </div>
          </div>
        ) : (
          <form noValidate onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1.5 w-full">
              <Label htmlFor="patient-phone">Phone</Label>
              <InputGroup>
                <InputGroupInput
                  id="patient-phone"
                  autoComplete="tel"
                  type="tel"
                  placeholder="9876543210"
                  name="phone"
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, ""); // digits only
                    if (val.length > 10) val = val.slice(0, 10);
                    formik.setFieldValue("phone", val);
                  }}
                  value={formik.values.phone}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  autoFocus
                />
                <InputGroupAddon>
                  <Phone />
                </InputGroupAddon>
              </InputGroup>

              {lookupState === "checking" && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Spinner className="h-3 w-3 animate-spin" />
                  Checking patient...
                </p>
              )}
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-error">{formik.errors.phone}</p>
              )}
            </div>
            {lookupState === "exists" && existingPatient && (
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="text-green-600" size={18} />
                    <p className="text-green-600 text-sm">
                      Patient already registered
                    </p>
                  </div>

                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">
                      Patient Name
                    </p>
                    <h1 className="font-medium text-sm">
                      {existingPatient.name}
                    </h1>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button">Open Patient</Button>

                  <Button
                    onClick={() => setShowAddVisitModal(true)}
                    type="button"
                    variant="ghost"
                  >
                    Add Visit
                  </Button>
                  <Button
                    onClick={() => setShowScheduleAppointmentModal(true)}
                    type="button"
                    variant="ghost"
                  >
                    Schedule Appointment
                  </Button>
                </div>
              </div>
            )}
            {lookupState === "new" &&
              (showCreatePatientForm ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="patient-name">Name</Label>
                    <InputGroup>
                      <InputGroupInput
                        id="patient-name"
                        name="name"
                        placeholder="Enter patient name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        onBlur={formik.handleBlur}
                      />
                      <InputGroupAddon>
                        <User2 />
                      </InputGroupAddon>
                    </InputGroup>

                    {formik.touched.name && formik.errors.name && (
                      <p className="text-error">{formik.errors.name}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="patient-notes">Notes</Label>
                    <Textarea
                      id="patient-notes"
                      name="notes"
                      rows={4}
                      onChange={formik.handleChange}
                      value={formik.values.notes}
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Patient"}
                  </Button>
                </>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <XCircle size={18} />
                    <h1>
                      No patient found.{" "}
                      <Button
                        variant={"link"}
                        onClick={() => setShowCreatePatientForm(true)}
                        className="p-0 text-red-600 font-bold"
                      >
                        Click here
                      </Button>{" "}
                      to add new Patient.
                    </h1>
                  </div>
                  <Button onClick={() => setShowCreatePatientForm(true)}>
                    <Plus />
                    Add New Patient
                  </Button>
                </div>
              ))}
          </form>
        )}
      </DialogContent>
      <ScheduleAppointmentModal
        showDialog={showScheduleAppointmentModal}
        onCloseDialog={() => setShowScheduleAppointmentModal(false)}
        patientId={
          existingPatient
            ? existingPatient._id!
            : newPatientCreated
              ? newPatientCreated._id
              : null
        }
      />
      {showAddVisitModal && (
        <AddVisitModal
          showDialog={showAddVisitModal}
          onCloseDialog={(v) => {
            setShowAddVisitModal(v);
          }}
          patientId={
            existingPatient
              ? existingPatient._id!
              : newPatientCreated
                ? newPatientCreated._id
                : null
          }
        />
      )}
    </Dialog>
  );
}
