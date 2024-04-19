import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Tooltip } from "react-tooltip";

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
      <Link to={`/update/${rowid}`} className="btn">
        <CiEdit
          data-tooltip-id="edit-tooltip"
          data-tooltip-content="Edit Record"
          data-tooltip-place="left"
        />
        <Tooltip id="edit-tooltip">Edit Record</Tooltip>
      </Link>
      <button onClick={handledelete} className="btn">
        <MdDelete
          data-tooltip-id="my-tooltip3"
          data-tooltip-content="Delete Record"
          data-tooltip-place="right"
        />
        <Tooltip id="my-tooltip3"/>
      </button>
    </div>
  );
}

export default ButtonComp;
