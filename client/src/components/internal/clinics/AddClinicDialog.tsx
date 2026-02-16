import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Mail, Phone, Stethoscope, User2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { errorHandler } from "@/lib/utils";

interface AddClinicDialogProps {
  showDialog: boolean;
  onCloseDialog: (show: boolean) => void;
}

export default function AddClinicDialog({
  showDialog,
  onCloseDialog,
}: AddClinicDialogProps) {
  const [loading, setLoading] = useState(false);
  const CreateClinicSchema = Yup.object().shape({
    clinicName: Yup.string().required("Clinic name is required"),
    doctorName: Yup.string().required("Docter name is required"),
    doctorEmail: Yup.string().required("Docter email is required"),
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10 digit mobile number")
      .required("Mobile number is required"),
  });
  const formik = useFormik({
    initialValues: {
      clinicName: "",
      doctorName: "",
      doctorEmail: "",
      phone: "",
    },
    validationSchema: CreateClinicSchema,
    onSubmit: (values) => handleCreateClinic(values),
  });

  const handleCreateClinic = async (values: {
    clinicName: string;
    doctorName: string;
    doctorEmail: string;
    phone: string;
  }) => {
    try {
      setLoading(true);
      const response = await api.post<{ success: boolean; message: string }>(
        "/internal/clinics",
        {
          clinicName: values.clinicName,
          doctorName: values.doctorName,
          doctorEmail: values.doctorEmail,
          phone: values.phone,
        },
      );
      if (response && response.data && response.data.success) {
        toast.success("Success", { description: response.data.message });
        onCloseDialog(false);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={showDialog} onOpenChange={onCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Clinic</DialogTitle>
          <DialogDescription>
            Fill the following details to create a Clinic
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="clinic-name">Clinic Name</Label>
            <InputGroup>
              <InputGroupInput
                id="clinic-name"
                autoComplete="name"
                type="text"
                placeholder="Enter clinic name"
                name="clinicName"
                onChange={formik.handleChange}
                value={formik.values.clinicName}
                onBlur={formik.handleBlur}
                autoFocus
              />
              <InputGroupAddon>
                <Stethoscope />
              </InputGroupAddon>
            </InputGroup>
            {formik.touched.clinicName && formik.errors.clinicName && (
              <p className="text-error">{formik.errors.clinicName}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="clinic-phone">Clinic Phone</Label>
            <InputGroup>
              <InputGroupInput
                id="clinic-phone"
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
              />
              <InputGroupAddon>
                <Phone />
              </InputGroupAddon>
            </InputGroup>
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-error">{formik.errors.phone}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="doctor-name">Doctor Name</Label>
            <InputGroup>
              <InputGroupInput
                id="doctor-name"
                autoComplete="name"
                type="text"
                placeholder="Enter doctor name"
                name="doctorName"
                onChange={formik.handleChange}
                value={formik.values.doctorName}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              <InputGroupAddon>
                <User2 />
              </InputGroupAddon>
            </InputGroup>
            {formik.touched.doctorName && formik.errors.doctorName && (
              <p className="text-error">{formik.errors.doctorName}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="clinic-email">Doctor Email</Label>
            <InputGroup>
              <InputGroupInput
                id="clinic-email"
                autoComplete="email"
                type="email"
                placeholder="your_email@example.com"
                name="doctorEmail"
                onChange={formik.handleChange}
                value={formik.values.doctorEmail}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
            </InputGroup>
            {formik.touched.doctorEmail && formik.errors.doctorEmail && (
              <p className="text-error">{formik.errors.doctorEmail}</p>
            )}
          </div>
          <Button type="submit">
            {loading && <Spinner />}
            Create clinic
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
