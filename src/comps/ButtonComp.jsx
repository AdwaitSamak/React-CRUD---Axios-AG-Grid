import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";

function ButtonComp(props) {
  // console.log(props);
  const rowid = props.rowid;
  console.log(rowid);
  const handledelete = (e) => {
    e.preventDefault();
    console.log(rowid);
    const confirm = window.confirm("Would you like to delete this record?");
    if (confirm) {
      axios
        .delete(`http://localhost:3000/users/${rowid}`)
        .then((res) => {
          location.reload();
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <div className="d-flex gap-2 justify-content-center">
      <Tooltip title="Edit">
        <Link to={`/update/${rowid}`} className="btn">
          <CiEdit />
        </Link>
      </Tooltip>
      <Tooltip title="Delete">
        <button onClick={handledelete} className="btn">
          <MdDelete />
        </button>
      </Tooltip>
    </div>
  );
}

export default ButtonComp;
