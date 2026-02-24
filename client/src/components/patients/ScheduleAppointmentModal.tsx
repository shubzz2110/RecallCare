import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { errorHandler, toDateObject } from "@/lib/utils";
import { api } from "@/lib/api";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Label } from "../ui/label";
import { DatePickerInput } from "../ui/date-picker-input";
import { Button } from "../ui/button";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface ScheduleAppointmentModalProps {
  showDialog: boolean;
  onCloseDialog: (show: boolean) => void;
  patientId: string | null;
}

export default function ScheduleAppointmentModal({
  showDialog,
  onCloseDialog,
  patientId,
}: ScheduleAppointmentModalProps) {
  const [scheduled, setScheduled] = useState<boolean>(false);

  const ScheduleAppointmentSchema = Yup.object().shape({
    date: Yup.string(),
  });

  const formik = useFormik({
    initialValues: { date: "" },
    validationSchema: ScheduleAppointmentSchema,
    onSubmit: (values) => handleScheduleAppointment(values),
  });

  const handleScheduleAppointment = async (values: {
    date: string | null | undefined;
  }) => {
    if (!patientId) return;
    try {
      await api.post("/appointments", {
        patientId,
        scheduledDate: values.date,
      });
      setScheduled(true);
    } catch (error) {
      errorHandler(error);
    }
  };
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
          <DialogTitle>Schedule Appointment</DialogTitle>
          <DialogDescription>
            Fill the following details to schedule the appointment
          </DialogDescription>
        </DialogHeader>
        {scheduled ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex items-center flex-col space-y-5">
              <CheckCircle2 size={100} stroke="green" strokeWidth={1} />
              <p className="text-foreground font-medium text-base text-center">
                Appointment has been created successfully
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="add-appointment-date">
                Appointment Date<span className="text-destructive">*</span>
              </Label>
              <DatePickerInput
                id="add-appointment-date"
                value={toDateObject(String(formik.values.date))}
                onChange={(date) => {
                  if (date) {
                    formik.setFieldValue("date", date);
                  }
                }}
                placeholder="DD/MM/YYYY HH:MM:AA"
                required
                showTime
              />
              {formik.touched.date && formik.errors.date && (
                <p className="text-error">{String(formik.errors.date)}</p>
              )}
            </div>
            <Button type="submit">Schedule Appointment</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
