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
import { Mail, Phone, Stethoscope } from "lucide-react";
import { Label } from "@/components/ui/label";

interface AddClinicDialogProps {
  showDialog: boolean;
  onCloseDialog: (show: boolean) => void;
}

export default function AddClinicDialog({
  showDialog,
  onCloseDialog,
}: AddClinicDialogProps) {
  const CreateClinicSchema = Yup.object().shape({
    name: Yup.string().required("Clinic name is required"),
    email: Yup.string().required("Clinic email is required"),
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10 digit mobile number")
      .required("Mobile number is required"),
  });
  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "" },
    validationSchema: CreateClinicSchema,
    onSubmit: (values) => handleCreateClinic(values),
  });

  const handleCreateClinic = (values: {
    name: string;
    email: string;
    phone: string;
  }) => {
    console.log(values);
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
            <Label htmlFor="clinic-name">Name</Label>
            <InputGroup>
              <InputGroupInput
                id="clinic-name"
                autoComplete="name"
                type="text"
                placeholder="Enter clinic name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                onBlur={formik.handleBlur}
                autoFocus
              />
              <InputGroupAddon>
                <Stethoscope />
              </InputGroupAddon>
            </InputGroup>
            {formik.touched.name && formik.errors.name && (
              <p className="text-error">{formik.errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="clinic-email">Email</Label>
            <InputGroup>
              <InputGroupInput
                id="clinic-email"
                autoComplete="email"
                type="email"
                placeholder="clinic_email@example.com"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
              />
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
            </InputGroup>
            {formik.touched.email && formik.errors.email && (
              <p className="text-error">{formik.errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="clinic-phone">Phone</Label>
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
              />
              <InputGroupAddon>
                <Phone />
              </InputGroupAddon>
            </InputGroup>
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-error">{formik.errors.phone}</p>
            )}
          </div>
          <Button type="submit">Create clinic</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
