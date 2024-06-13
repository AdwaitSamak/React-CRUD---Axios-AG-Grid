import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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
    dob: "",
  });

  const navigate = useNavigate();
  const onhandleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3000/users", values).then(
      (res) => navigate("/") //we need to navigate to home page
    );
  };
  return (
    <div className="d-flex w-100 py-4 justify-content-center align-items-center bg-light ">
      <div className="w-50 border bg-white shadow px-5 pt-2 pb-3 rounded">
        <h1>Add User</h1>
        <form onSubmit={onhandleSubmit}>
          <div className="mb-2">
            <label className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter Name"
              onChange={(e) => {
                setValues({ ...values, name: e.target.value });
              }}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">
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
          <div className="mb-2">
            <label className="form-label">
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
          <div className="mb-2">
            <label className="form-label">
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
          <div className="mb-2">
            <label className="form-label">
              Country
            </label>
            <input
              type="text"
              className="form-control"
              id="country"
              placeholder="Enter Country"
              onChange={(e) =>
                setValues({ ...values, country: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label className="form-label">
              Date of Birth
            </label>
            <DatePicker
              id="dob"
              className="form-control"
              onChange={(newValue) => setValues({ ...values, dob: dayjs(newValue).format('DD-MM-YYYY') })}
            />
          </div>
          <button type="submit" className="btn btn-outline-dark">
            Submit
          </button>
          <Link to="/">
            <button type="submit" className="btn btn-dark ms-3">
              Cancel
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Create;
