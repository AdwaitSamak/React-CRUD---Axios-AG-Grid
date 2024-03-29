import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function GetidDelete() {
  const navigate = useNavigate();
  const [id, setId] = useState(0);

  const handleDelete = () => {
    const confirm = window.confirm("Would you like to delete this record?");
    if (confirm) {
      axios
        .delete("http://localhost:3000/users/" + id)
        .then((res) => {
            navigate("/");
        })
        .catch((error) => console.log(error));
    }
    
  };
  return (
    <div className="w-100 vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <h3 className="text-center m-3">Enter Id of the User</h3>
      <div className="d-flex flex-column align-items-center">
        <input
          type="number"
          className="form-control w-50 m-auto mb-3 "
          onChange={(e) => {
            setId(e.target.value);
          }}
        />
        <button className="btn btn-success" onClick={handleDelete}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default GetidDelete;