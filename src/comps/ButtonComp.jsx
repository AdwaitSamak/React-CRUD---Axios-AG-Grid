import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { Dialog, DialogActions, DialogTitle, Drawer } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function ButtonComp(props) {
  // console.log(props);
  const rowid = props.rowid;
  console.log(rowid);

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
        console.log(response.data[0]);
        setValues(response.data[0]);
      } catch (error) {
        console.log("Error in fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handledelete = (e) => {
    console.log(rowid);
    axios
      .delete(`http://localhost:3000/users/${rowid}`)
      .then((res) => {
        location.reload();
      })
      .catch((error) => console.log(error));
  };

  const toggleupdatedrawer = (newoption) => {
    setupdatedrawer(newoption);
  };

  const handleUpdateform = (e) => {
    e.preventDefault();
    // console.log(id);
    const url = `http://localhost:3000/users/${rowid}`;
    axios
      .put(url, values)
      .then((res) => location.reload())
      .catch((error) => console.log("Error updating user:", error));
  };

  const DrawerList = //update drawer
    (
      <div
        className="d-flex w-100 justify-content-center align-items-center bg-light"
        style={{ width: "500px" }}
      >
        <div
          className=" border bg-white shadow px-5 pt-1 rounded"
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
          <form onSubmit={handleUpdateform} style={{ width: "300px" }}>
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
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
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
                onChange={(e) =>
                  setValues({ ...values, phone: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <input
                type="text"
                className="form-control"
                id="country"
                placeholder="Enter Country"
                value={values?.country}
                onChange={(e) =>
                  setValues({ ...values, country: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dob" className="form-label">
                Date of Birth
              </label>
              <DatePicker
                id="dob"
                className="form-control"
                // value={values?.dob}
                onChange={(newValue) =>
                  setValues({
                    ...values,
                    dob: dayjs(newValue).format("DD-MM-YYYY"),
                  })
                }
              />
            </div>
            {/* update drawer's submit buttonm */}
            <button type="submit" className="btn btn-outline-dark">
              Submit                       
            </button>   
                     {/* update drawer's cancel button */}
            <button
              type="submit"
              className="btn btn-dark ms-3"
              onClick={() => toggleupdatedrawer(false)}
            >
              Cancel
            </button>
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
