import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Create() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => {
      const len = String(res.data.length + 1);
      setValue("id", len);
    });
  }, []);

  const onSubmit = (data) => {
    axios.post("http://localhost:3000/users", data).then(
      () => navigate("/") // Navigate to home page
    );
  };

  return (
    <div className="d-flex w-100 py-5 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg-white shadow pt-2 pb-3 rounded d-flex flex-column align-items-center">
        <h1>Add User</h1>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "300px" }}>
          {["name", "username", "email", "phone", "country"].map((field) => (
            <div className="mb-3" key={field}>
              <label  className="form-label">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                className="form-control"
                id={field}
                placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                {...register(field, {
                  //second field is options where we can specify required, its message, patterns for a field
                  required: `${
                    field.charAt(0).toUpperCase() + field.slice(1)
                  } is required`,
                  ...(field === "email" && {
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  }),
                })}
              />
              {errors[field] && (
                <div className="text-danger">{errors[field].message}</div>
              )}
            </div>
          ))}
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-outline-dark">
              Submit
            </button>
            <Link type="button" className="btn btn-dark" to="/">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Create;
