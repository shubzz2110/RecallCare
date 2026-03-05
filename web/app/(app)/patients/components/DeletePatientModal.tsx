"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { useDeletePatient } from "@/hooks/usePatientData";
import { Trash2Icon } from "lucide-react";

interface DeletePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

export default function DeletePatientModal({
  isOpen,
  onClose,
  patientId,
}: DeletePatientModalProps) {
  const { mutate: deletePatient, isPending } = useDeletePatient(patientId);

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Patient</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this patient record. Are you sure you
            want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() =>
              deletePatient(undefined, {
                onSuccess: () => {
                  toast.success("Patient deleted successfully");
                  onClose();
                },
              })
            }
            disabled={isPending}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
