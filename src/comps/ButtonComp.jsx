import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";

function ButtonComp(props) {
  // console.log(props);
  const rowid = props.rowid;
  console.log(rowid);

  const [modalopen, setModalOpen] = useState(false);

  const handleClickOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handledelete = (e) => {
    e.preventDefault();
    console.log(rowid);
    axios
      .delete(`http://localhost:3000/users/${rowid}`)
      .then((res) => {
        location.reload();
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="d-flex gap-2 justify-content-center">
      <Tooltip title="Edit">
        <Link to={`/update/${rowid}`} className="btn">
          <CiEdit />
        </Link>
      </Tooltip>
      <Tooltip title="Delete">
        <button onClick={handleClickOpen} className="btn">
          <MdDelete />
        </button>
      </Tooltip>

      <Dialog open={modalopen} onClose={handleClose}>
        <DialogTitle>{"Do you want to delete this record?"}</DialogTitle>
        <DialogActions>
          <button onClick={handleClose} className="px-3 border-1">No</button>
          <button onClick={handledelete} className="px-3 border-1">Yes</button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ButtonComp;
