import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Update() {
  const { id } = useParams();
  const [values, setValues] = useState({
    id: id,
    name: "",
    username: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/users?id=" + id
        );
        console.log(response.data[0]);
        setValues(response.data[0]);
      } catch (error) {
        console.log("Error in fetching data", error);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleUpdateform = (e) => {
    e.preventDefault();
    // console.log(id);
    const url = `http://localhost:3000/users/${id}`;
    axios
      .put(url, values)
      .then((res) => navigate("/")) // Navigate to the home page after successful update
      .catch((error) => console.log("Error updating user:", error));
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light ">
      <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
        <h1>Update User</h1>
        {/* <hr/> */}
        <form onSubmit={handleUpdateform}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter Name" // lodash
              value={values?.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
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
              value={values?.username}
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
              value={values?.email}
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
              value={values?.phone}
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

export default Update;
