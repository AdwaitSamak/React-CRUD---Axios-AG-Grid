import axios from "axios";
import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { Dialog, DialogActions, DialogTitle, Drawer } from "@mui/material";

function ButtonComp(props) {
  const rowid = props.rowid;

  const [modalopen, setModalOpen] = useState(false);
  const [updatedrawer, setupdatedrawer] = useState(false);

  const handleClickOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const [values, setValues] = useState({
    id: rowid,
    name: "",
    username: "",
    email: "",
    phone: "",
    country: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/users?id=" + rowid
        );
        setValues(response.data[0]);
      } catch (error) {
        console.log("Error in fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handledelete = (e) => {
    axios
      .delete(`http://localhost:3000/users/${rowid}`)
      .then(() => {
        location.reload();
      })
      .catch((error) => console.log(error));
  };

  const toggleupdatedrawer = (newoption) => {
    setupdatedrawer(newoption);
  };

  const handleUpdateform = (e) => {
    e.preventDefault();
    const url = `http://localhost:3000/users/${rowid}`;
    axios
      .put(url, values)
      .then(() => location.reload())
      .catch((error) => console.log("Error updating user:", error));
  };

  const DrawerList = //update drawer
    (
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
          {/* <hr/> */}
          <form onSubmit={handleUpdateform} className="drawer-form">
        {["name", "username", "email", "phone", "country"].map((field) => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}    
              {/* N + ame */}
            </label>
            <input
              type="text"
              className="form-control"
              id={field}
              placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              value={values?.[field]}          //from fetched row's data's fields
              onChange={(e) =>
                setValues({ ...values, [field]: e.target.value })
              }
            />
          </div>
        ))}
        <div className="d-flex justify-content-center align-items-center gap-5">
        <button type="submit" className="btn btn-outline-dark btn-submit">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-dark btn-cancel"
          onClick={() => toggleupdatedrawer(false)}
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
        	                      {/* EDIT button */}
      <Tooltip title="Edit">                      
        <button onClick={(e) => toggleupdatedrawer(true)} className="btn">    
          <CiEdit />
        </button>
      </Tooltip>
      <Drawer
        open={updatedrawer} //update drawer opens when true
        onClose={() => toggleupdatedrawer(false)}
        anchor="right"
      >
        {DrawerList}
      </Drawer>

                                {/* DELETE button */}
      <Tooltip title="Delete">
        <button onClick={handleClickOpen} className="btn">
          <MdDelete />
        </button>
      </Tooltip>

                              {/* dialog for delete */}
      <Dialog open={modalopen} onClose={handleClose}>
        <DialogTitle>{"Do you want to delete this record?"}</DialogTitle>
        <DialogActions>
          <button onClick={handleClose} className="px-3 border-1">
            No
          </button>
          <button onClick={handledelete} className="px-3 border-1">
            Yes
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ButtonComp;
