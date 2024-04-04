import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import Dropdown from "react-bootstrap/Dropdown";

function Home() {
  let gridApi = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]); // State to store selected rows
  const [showPreferences, setShowPreferences] = useState(false);
  const [userpreferencemap, setUserpreferencemap] = useState({ select: true });
  const [selectedrowid, setSelectedrowid] = useState([]);

  useEffect(() => {
    if (selectedRows) {
      const arr = [];
      selectedRows.forEach((val) => {
        arr.push(val.id);
      });
      setSelectedrowid(arr);
      // console.log(arr);
    }
  }, [selectedRows]);

  const colDefs = [
    {
      headerName: "Select",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
    },
    { headerName: "Id", field: "id", width: 150 },
    { headerName: "Name", field: "name", width: 150 },
    { headerName: "Username", field: "username", width: 150 },
    { headerName: "Email", field: "email", width: 150 },
    { headerName: "Phone", field: "phone", width: 150 },
  ];

  const onGridReady = (params) => {
    gridApi.current = params.api; // Initialize the grid and give access to the grid API
  };

  const [data, setData] = useState([]);
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
  };

  const handleOnChangeCheckbox = (field, checked) => {
    setUserpreferencemap((prevPreferences) => ({
      ...prevPreferences,
      [field]: checked,
    }));
  };

  const handleDelete = () => {
    const confirm = window.confirm("Would you like to delete this record?");
    const num = selectedrowid[0];
    console.log(num);
    console.log(typeof num);
    if (confirm) {
      axios
        .delete(`http://localhost:3000/users/${selectedrowid[0]}`)
        .then((res) => {
          location.reload();
        })
        .catch((error) => console.log(error));
    }
  };

  const visibleColDefs = colDefs.filter(
    (column) => userpreferencemap[column.field] === true
  );

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center bg-light m-4 p-2"
      style={{ height: "100vh" }}
    >
      <div
        className="w-75 rounded bg-white border shadow p-4"
        style={{ width: "90%" }}
      >
        <div className="d-flex gap-5">
          <Dropdown className="">
            <Dropdown.Toggle variant="primary" id="dropdown-basic-button">
              Actions
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href={`/read/${selectedrowid[0]}`}>
                Read
              </Dropdown.Item>
              <Dropdown.Item href={`/update/${selectedrowid[0]}`}>
                Action
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic-button">
              Preferences
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handlePreferences}>
                Preferences
              </Dropdown.Item>
              <Dropdown.Item onClick={savepreferences}>Save</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="d-flex gap-5 align-items-center justify-content-center p-3">
            {showPreferences && (
              <div className="d-flex gap-2">
                {colDefs.map((column) => (
                  <label key={column.headerName.toLowerCase()}>
                    <input
                      type="checkbox"
                      checked={userpreferencemap[column.field]}
                      disabled={column.headerName === "Select"}
                      onChange={(e) =>
                        handleOnChangeCheckbox(column.field, e.target.checked)
                      }
                    />
                    {column.headerName}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="table-responsive d-flex justify-content-end">
          <Link to="/create" className="btn btn-success mb-3">
            Add User
          </Link>
        </div>
        <div
          className="ag-theme-quartz"
          style={{ height: "58vh", width: "100%" }}
        >
          <AgGridReact
            rowData={data}
            columnDefs={visibleColDefs}
            onGridReady={onGridReady}
            suppressHorizontalScroll={true}
            rowSelection="multiple"
            onSelectionChanged={(event) => {
              setSelectedRows(event.api.getSelectedRows());
              // console.log(selectedRows);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
