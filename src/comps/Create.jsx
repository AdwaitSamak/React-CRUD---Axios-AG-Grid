import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Create() {
  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => {
      const len = res.data.length + 1;
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
  });

  const navigate = useNavigate();
  const onhandleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3000/users", values).then(
      (res) => navigate("/") //we need to navigate to home page
    );
  };
  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light ">
      <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
        <h1>Add User</h1>
        <form onSubmit={onhandleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter Name"
              onChange={(e) => {
                e.preventDefault();
                setValues({ ...values, name: e.target.value });
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter Username"
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              className="form-control"
              id="phone"
              placeholder="Enter Phone"
              onChange={(e) => setValues({ ...values, phone: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
          <Link to="/">
            <button type="submit" className="btn btn-danger ms-3">
              Cancel
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Create;
