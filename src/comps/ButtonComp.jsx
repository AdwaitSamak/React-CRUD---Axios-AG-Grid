import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
function ButtonComp(props) {
  console.log(props);
  const rowid = props.rowid;
  //   console.log(rowid);
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
    <div className="d-flex gap-2 mt-2 mb-1 justify-content-center">
      <Link to={`/update/${rowid}`} className="btn btn-primary btn-sm">
        Edit
      </Link>
      <button
        onClick={handledelete}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    </div>
  );
}

export default ButtonComp;
