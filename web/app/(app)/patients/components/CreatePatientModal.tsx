"use client";

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
import { useCreatePatient } from "@/hooks/usePatientData";
import { useFormik } from "formik";
import { Phone, Plus, User2 } from "lucide-react";
import * as Yup from "yup";

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePatientSchema = Yup.object().shape({
  name: Yup.string().required("Patient name is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10 digit mobile number")
    .required("Mobile number is required"),
});

export default function CreatePatientModal({
  isOpen,
  onClose,
}: CreatePatientModalProps) {
  const { mutateAsync: createPatient, isPending } = useCreatePatient();

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
    },
    validationSchema: CreatePatientSchema,
    onSubmit: (values) => handleCreatePatient(values),
  });

  const handleCreatePatient = async (values: {
    name: string;
    phone: string;
  }) => {
    await createPatient(values, {
      onSuccess: () => {
        toast.success("Patient created successfully");
        formik.resetForm();
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Patient</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new patient record.
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={formik.handleSubmit} className="space-y-5">
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
            <Plus />
            Add New Patient
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
