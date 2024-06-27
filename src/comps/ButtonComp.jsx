import axios from "axios";
import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { Dialog, DialogActions, DialogTitle, Drawer } from "@mui/material";
import { useForm } from "react-hook-form";

function ButtonComp(props) {
  const rowid = props.rowid;
  const [modalopen, setModalOpen] = useState(false);
  const [updatedrawer, setupdatedrawer] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const handleClickOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {          //to setValues of the form 
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/users?id=" + rowid
        );
        const userData = response.data[0];
        // console.log(userData);
        Object.keys(userData).forEach(key => setValue(key, userData[key]));  //setValues -> name: "", etc
      } catch (error) {
        console.log("Error in fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3000/users/${rowid}`)
      .then(() => {
        location.reload();
      })
      .catch((error) => console.log(error));
  };

  const toggleUpdateDrawer = (newOption) => {
    setupdatedrawer(newOption);
  };

  const onSubmit = (data) => {
    const url = `http://localhost:3000/users/${rowid}`;
    axios
      .put(url, data)
      .then(() => location.reload())
      .catch((error) => console.log("Error updating user:", error));
  };

  const DrawerList = (
    <div
      className="d-flex w-100 justify-content-center align-items-center bg-light"
      style={{ width: "500px" }}
    >
      <div
        className=" border bg-white shadow px-5 pt-5 rounded"
        style={{
          width: "400px",
          height: "640px",
          marginTop: "10px",
          marginLeft: "30px",
          marginRight: "30px",
        }}
      >
        <h1>Update User</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="drawer-form">
          {["name", "username", "email", "phone", "country"].map((field) => (
            <div className="mb-3" key={field}>
              <label htmlFor={field} className="form-label">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                className="form-control"
                id={field}
                placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                {...register(field, {
                  required: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
                  ...(field === "email" && {
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address"
                    }
                  })
                })}
              />
              {errors[field] && <span className="text-danger">{errors[field].message}</span>}
            </div>
          ))}
          <div className="d-flex justify-content-center align-items-center gap-5">
            <button type="submit" className="btn btn-outline-dark btn-submit">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-dark btn-cancel"
              onClick={() => toggleUpdateDrawer(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="d-flex gap-2 justify-content-center">
      <Tooltip title="Edit">
        <button onClick={() => toggleUpdateDrawer(true)} className="btn">
          <CiEdit />
        </button>
      </Tooltip>
      <Drawer
        open={updatedrawer}
        onClose={() => toggleUpdateDrawer(false)}
        anchor="right"
      >
        {DrawerList}
      </Drawer>

      <Tooltip title="Delete">
        <button onClick={handleClickOpen} className="btn">
          <MdDelete />
        </button>
      </Tooltip>

      <Dialog open={modalopen} onClose={handleClose}>
        <DialogTitle>{"Do you want to delete this record?"}</DialogTitle>
        <DialogActions>
          <button onClick={handleClose} className="px-3 border-1">
            No
          </button>
          <button onClick={handleDelete} className="px-3 border-1">
            Yes
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ButtonComp;
