import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonComp from "./ButtonComp";
import { SlOptionsVertical } from "react-icons/sl";
import { IoMdAdd } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import { BiSolidHide } from "react-icons/bi";
import { MdSave } from "react-icons/md";

function Home() {
  let gridApi = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]); // State to store selected rows
  const [showPreferences, setShowPreferences] = useState(false);
  const [userpreferencemap, setUserpreferencemap] = useState({ select: true });
  const [selectedrowid, setSelectedrowid] = useState(null);
  const [data, setData] = useState([]);
  const [isrowselected, setisrowselected] = useState(false);

  useEffect(() => {
    if (selectedRows && selectedRows.length > 0) {
      let row = selectedRows[0];
      // console.log(row.id);
      setSelectedrowid(row.id);
      setisrowselected(true);
    }
  }, [selectedRows]);

  const colDefs = [
    { headerName: "Id", field: "id", width: 150 },
    { headerName: "Name", field: "name", width: 150 },
    { headerName: "Username", field: "username", width: 150 },
    { headerName: "Email", field: "email", width: 150 },
    { headerName: "Phone", field: "phone", width: 150 },
    {
      headerName: "Actions",
      width: 150,
      cellRenderer: ButtonComp,
      cellRendererParams: (params) => ({ rowid: params.data.id }),
    },
  ];

  const onGridReady = (params) => {
    gridApi.current = params.api; // Initialize the grid and give access to the grid API
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setData(response.data);
      } catch (error) {
        console.log("Error in fetching data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storedPreferences = localStorage.getItem("userpreferencemap");
    if (storedPreferences) {
      setUserpreferencemap(JSON.parse(storedPreferences));
    } else {
      const initialPreferences = {};
      colDefs.forEach((column) => {
        initialPreferences[column.field] = true;
      });
      setUserpreferencemap(initialPreferences);
    }
  }, []);

  useEffect(() => {
    if (colDefs) {
      const visibleColumns = colDefs.filter(
        (column) => userpreferencemap[column.field] === true
      );
      const gridWidth = document.querySelector(".ag-theme-quartz").clientWidth;
      const columnWidth = gridWidth / visibleColumns.length;

      visibleColumns.forEach((column) => {
        gridApi.current?.setColumnWidth(column.field, columnWidth);
      });
    }
  }, [colDefs]);

  const handlePreferences = () => {
    if (!showPreferences) {
      alert("Uncheck the boxes to hide columns");
      setShowPreferences(true);
    } else {
      setShowPreferences(false);
    }
  };

  const savepreferences = () => {
    localStorage.setItem(
      "userpreferencemap",
      JSON.stringify(userpreferencemap)
    );
    setShowPreferences((prev) => !prev);
  };

  const handleOnChangeCheckbox = (field, checked) => {
    setUserpreferencemap((prevPreferences) => ({
      ...prevPreferences,
      [field]: checked,
    }));
  };

  const visibleColDefs = colDefs.filter(
    (column) => userpreferencemap[column.field] === true
  );

  return (
    <div className="d-flex bg-light m-3 p-2 h-100 flex-column border shadow rounded-3">
      <Link
        to="/create"
        className="btn btn-success mb-3 btn-sm"
        style={{ width: "30px" }}
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Add Record"
        data-tooltip-place="top"
      >
        <IoMdAdd />
        <Tooltip id="my-tooltip" />
      </Link>
      
      <div className="d-flex gap-3 justify-content-end">
        <div
          className="ag-theme-quartz"
          style={{ height: "83vh", width: "89%" }}
        >
          <AgGridReact
            rowData={data}
            columnDefs={visibleColDefs}
            onGridReady={onGridReady}
            rowSelection="single"
            onSelectionChanged={(event) => {
              setSelectedRows(event.api.getSelectedRows());
            }}
            className="w-100 h-100"
          />
        </div>
        <div className="d-flex flex-column gap-3 ">
          <Dropdown>
            <Dropdown.Toggle
              className="btn btn-sm"
              onClick={handlePreferences}
              data-tooltip-id="my-tooltip4"
              data-tooltip-content="Preferences"
              data-tooltip-place="bottom"
            >
              <SlOptionsVertical />
              <Tooltip id="my-tooltip4" />
              {/* for hover effect */}
            </Dropdown.Toggle>
          </Dropdown>
          {showPreferences && (
            <div className="d-flex gap-2 flex-column align-items-left justify-content-center">
              {colDefs.map((column) => (
                <label key={column.headerName.toLowerCase()}>
                  <input
                    type="checkbox"
                    checked={userpreferencemap[column.field]}
                    disabled={column.headerName === "Actions"}
                    onChange={(e) =>
                      handleOnChangeCheckbox(column.field, e.target.checked)
                    }
                  />
                  {column.headerName}
                </label>
              ))}
              <button
                onClick={savepreferences}
                className="btn btn-lg"
                data-tooltip-id="save-tooltip"
                data-tooltip-content="Save Preferences"
                data-tooltip-place="bottom"
              >
                <MdSave />
                <Tooltip id="save-tooltip" style={{ fontSize: "12px" }} />
              </button>
            </div>
          )}
        </div>
      </div>
      {isrowselected && (
        <div className="d-flex w-100 vh-100 justify-content-center align-items-center gap-3">
          <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
            <h3>Details of the User</h3>
            <div className="mb-2">
              <strong>Name: {selectedRows[0].name}</strong>
            </div>
            <div className="mb-2">
              <strong>Username: {selectedRows[0].username}</strong>
            </div>
            <div className="mb-2">
              <strong>Email: {selectedRows[0].email}</strong>
            </div>
            <div className="mb-2">
              <strong>Phone: {selectedRows[0].phone}</strong>
            </div>
          </div>
          <button
            className="btn btn-lg"
            onClick={(e) => setisrowselected(false)}
          >
            <BiSolidHide />
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
