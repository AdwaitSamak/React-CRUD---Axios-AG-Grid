import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Create() {
  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => {
      const len = String(res.data.length + 1);
      setValues((prev) => ({
        ...prev,
        id: len,
      }));
    });
  }, []);
  const [values, setValues] = useState({
    id: null,
    name: "",
    username: "",
    email: "",
    phone: "",
    country: "",
  });

  const navigate = useNavigate();
  const onhandleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3000/users", values).then(
      (res) => navigate("/") //we need to navigate to home page
    );
  };
  return (
    <div className="d-flex w-100 py-5 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg-white shadow pt-2 pb-3 rounded d-flex flex-column align-items-center">
        <h1>Add User</h1>
        <form onSubmit={onhandleSubmit} style={{ width: "300px" }}>
        {["name", "username", "email", "phone", "country"].map((field) => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              className="form-control"
              id={field}
              placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}  //N+ame
              value={values?.[field] || ''}   
              onChange={(e) => setValues({ ...values, [field]: e.target.value })}
            />
          </div>
        ))}
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-outline-dark">
            Submit
          </button>
          <button type="button" className="btn btn-dark" onClick={() => toggleupdatedrawer(false)}>
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default Create;
