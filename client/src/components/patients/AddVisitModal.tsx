import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import * as yup from "yup";
import { Label } from "../ui/label";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { errorHandler, toDateObject } from "@/lib/utils";
import { api } from "@/lib/api";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface AddVisitDialogProps {
  showDialog: boolean;
  onCloseDialog: (show: boolean) => void;
  patientId: string | null;
}

export default function AddVisitModal({
  showDialog,
  onCloseDialog,
  patientId,
}: AddVisitDialogProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const AddVisitSchema = yup.object().shape({
    visitDate: yup.string(),
    notes: yup.string().notRequired(),
    followUpDate: yup.string().notRequired(),
  });

  const formik = useFormik({
    initialValues: {
      visitDate: new Date(),
      notes: "",
      followUpDate: "",
    },
    validationSchema: AddVisitSchema,
    onSubmit: (values) => handleAddVisit(values),
  });

  const handleAddVisit = async (values: {
    visitDate: string | Date;
    notes?: string;
    followUpDate?: string;
  }) => {
    try {
      setLoading(true);
      await api.post("/visits", {
        visitDate: values.visitDate,
        notes: values.notes,
        followUpDate: values.followUpDate,
        patientId: patientId,
      });
      setSuccess(true);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={showDialog}
      onOpenChange={() => {
        // formik.resetForm();
        onCloseDialog(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Visit</DialogTitle>
          <DialogDescription>
            Fill the following fields to create a visit
          </DialogDescription>
        </DialogHeader>
        <h1 className="text-muted-foreground font-normal text-sm">
          <span className="text-destructive">*</span>Indicates required fields
        </h1>
        {success ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex items-center flex-col space-y-5">
              <CheckCircle2 size={100} stroke="green" strokeWidth={1} />
              <p className="text-foreground font-medium text-base text-center">
                Visit has been created successfully
              </p>
            </div>
          </div>
        ) : (
          <form noValidate onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="add-visit-date">
                Visit Date<span className="text-destructive">*</span>
              </Label>
              <DatePickerInput
                id="add-visit-date"
                value={toDateObject(String(formik.values.visitDate))}
                onChange={(date) => {
                  if (date) {
                    formik.setFieldValue("visitDate", date);
                  }
                }}
                placeholder="DD/MM/YYYY"
                required
                disabled={loading}
              />
              {formik.touched.visitDate && formik.errors.visitDate && (
                <p className="text-error">{String(formik.errors.visitDate)}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="add-visit-notes">Treatment Notes</Label>
              <Textarea
                placeholder="Enter treatment notes"
                rows={4}
                value={formik.values.notes}
                onChange={formik.handleChange}
                name="notes"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="add-visit-follow">Follow Up Date</Label>
              <DatePickerInput
                id="add-visit-follow"
                value={toDateObject(String(formik.values.followUpDate))}
                onChange={(date) => {
                  if (date) {
                    formik.setFieldValue("followUpDate", date);
                  }
                }}
                placeholder="DD/MM/YYYY"
                disabled={loading}
              />
            </div>
            <Button type="submit">Add Visit</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
