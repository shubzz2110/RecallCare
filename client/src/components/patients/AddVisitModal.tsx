import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface AddVisitDialogProps {
  showDialog: boolean;
  onCloseDialog: (show: boolean) => void;
}

export default function AddVisitModal({
  showDialog,
  onCloseDialog,
}: AddVisitDialogProps) {
  console.log(showDialog);
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
      </DialogContent>
    </Dialog>
  );
}
