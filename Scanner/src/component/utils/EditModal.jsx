import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Editform } from "../Editform";

export default function EditModal({ user,setUserData }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        className='flex justify-center items-center content-center mt-8 rounded-full ring-2 ring-blue-500 ring-offset- ring-offset-slate-50 dark:ring-offset-slate-900 ...">
  Save Changes'
      >
        Edit Details
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title "
          className="bg-blue-800"
        ></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Editform userData={user} setOpen={setOpen} setUserData={setUserData} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
