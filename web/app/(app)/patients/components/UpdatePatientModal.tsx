import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useUpdatePatient } from "@/hooks/usePatientData";
import { Patient } from "@/types/types";
import { useFormik } from "formik";
import { Edit, Phone, User2 } from "lucide-react";
import * as Yup from "yup";

interface UpdatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

const UpdatePatientSchema = Yup.object().shape({
  name: Yup.string().required("Patient name is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10 digit mobile number")
    .required("Mobile number is required"),
});

export default function UpdatePatientModal({
  isOpen,
  onClose,
  patient,
}: UpdatePatientModalProps) {
  const { mutateAsync: updatePatient, isPending } = useUpdatePatient(
    patient._id,
  );
  const formik = useFormik({
    initialValues: {
      name: patient.name || "",
      phone: patient.phone || "",
    },
    validationSchema: UpdatePatientSchema,
    onSubmit: (values) => handleUpdatePatient(values),
  });

  const handleUpdatePatient = async (values: {
    name: string;
    phone: string;
  }) => {
    await updatePatient(values, {
      onSuccess: () => {
        toast.success("Patient updated successfully");
        formik.resetForm();
        onClose();
      },
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Patient - {patient.name}</DialogTitle>
          <DialogDescription>
            Update patient information for {patient.name}
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="update-patient-name">Name</Label>
            <InputGroup>
              <InputGroupInput
                id="update-patient-name"
                name="name"
                placeholder="Enter patient name"
                onChange={formik.handleChange}
                value={formik.values.name}
                onBlur={formik.handleBlur}
                disabled={isPending}
              />
              <InputGroupAddon>
                <User2 />
              </InputGroupAddon>
            </InputGroup>

            {formik.touched.name && formik.errors.name && (
              <p className="text-error">{formik.errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="update-patient-phone">Phone</Label>
            <InputGroup>
              <InputGroupInput
                id="update-patient-phone"
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
                disabled={isPending}
              />
              <InputGroupAddon>
                <Phone />
              </InputGroupAddon>
            </InputGroup>
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-error">{formik.errors.phone}</p>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            <Edit />
            Update Patient
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
