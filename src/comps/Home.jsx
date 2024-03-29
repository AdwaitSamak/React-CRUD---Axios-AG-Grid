import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";

function Home() {
  let gridApi = useRef(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [userpreferencemap, setUserpreferencemap] = useState({});

  const colDefs = [
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
    const url = "http://localhost:3000/users";
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.log("Error in fetching data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // jab component start hoga, apan local storage se userpreferencemap uthayenge
    const storedPreferences = localStorage.getItem("userpreferencemap");
    if (storedPreferences) {
      setUserpreferencemap(JSON.parse(storedPreferences));
    } else {
      // initial case me agar userpreference map nahi mila to apan sare columns ko initially true set kr denge, so that all are visible
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

  // console.log(userpreferencemap);

  const handlePreferences = (e) => {
    e.preventDefault();
    setShowPreferences((prev) => !prev);
    if (!showPreferences) alert("Deselect the columns you want to hide");
  };

  const savepreferences = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "userpreferencemap",
      JSON.stringify(userpreferencemap)
    );
  };

  const handleOnChangeCheckbox = (field, checked) => {
    setUserpreferencemap((prevPreferences) => ({
      ...prevPreferences, //apan spread kr rhe hai previous map ko and just changing the field changed field
      [field]: checked,
    }));
  };

  const visibleColDefs = colDefs.filter(
    (column) => userpreferencemap[column.field]===true
  );

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light m-4 p-2">
      <div className="w-75 rounded bg-white border shadow p-4">
        <div className="table-responsive d-flex justify-content-end">
          <Link to="/create" className="btn btn-success">
            Add User
          </Link>
        </div>
        <div
          className="ag-theme-quartz"
          style={{ height: 302, width: 750, justifyContent: "center" }}
        >
          <AgGridReact
            rowData={data}
            columnDefs={visibleColDefs}
            onGridReady={onGridReady}
            suppressHorizontalScroll={true}
          />
        </div>
      </div>
      <div className="d-flex flex-row m-3 gap-5 p-3">
        <Link to={`/getid`} className="btn btn-primary me-2">
          Read
        </Link>
        <Link to={`/getidedit`} className="btn btn-primary me-2">
          Edit
        </Link>
        <Link to={`/getiddelete`} className="btn btn-danger">
          Delete
        </Link>
      </div>
      <div className="d-flex gap-5 align-items-center justify-content-center">
        <button onClick={handlePreferences} className="btn btn-primary">Preferences</button>
        <div>
          {showPreferences && (
            <div className="d-flex gap-2">
              {colDefs.map((column) => (
                <label key={column.field}>
                  <input
                    type="checkbox"
                    checked={userpreferencemap[column.field]}
                    disabled={column.field === "srno"} //we dont want user to hide srno, we we disbale toggling checkbox for it
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
        <button onClick={savepreferences} className="btn btn-success">Save</button>
      </div>
    </div>
  );
}

export default Home;
