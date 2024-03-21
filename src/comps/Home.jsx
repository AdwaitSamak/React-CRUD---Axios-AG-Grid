import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";

function Home() {
  let gridApi = useRef(null);
  const [userpreferencemap, setUserpreferencemap] = useState({});
  const colDefs = [
    { headerName: "Id", field: "id", width: 150 },
    { headerName: "Name", field: "name", width: 150 },
    { headerName: "Username", field: "username", width: 150 },
    { headerName: "Email", field: "email", width: 150 },
    { headerName: "Phone", field: "phone", width: 150 },
    {
      headerName: "Operations",
      cellRenderer: "operationsCellRenderer",
      width: 200,
      suppressSizeToFit: true,
      cellStyle: { textAlign: "center" },
    },
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
        setUserpreferencemap(response.data[0]);
      } catch (error) {
        console.log("Error in fetching data", error);
      }
    };
    fetchData();
  }, []);

  const OperationsCellRenderer = ({ data }) => {
    const navigate = useNavigate();
  
    const handleRead = (id) => {
      navigate(`/read/${id}`);
    };
  
    const handleEdit = (id) => {
      navigate(`/update/${id}`);
    };
  }

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
          style={{ height: 300, width: 750, justifyContent: "center" }}
        >
          <AgGridReact
            rowData={data}
            columnDefs={colDefs.filter(
              (column) => userpreferencemap[column.field]
            )}
            onGridReady={onGridReady}
            suppressHorizontalScroll={true}
          />
        </div>
      </div>
      <div className="d-flex flex-row m-3 gap-5 p-3">
        <Link to={`/getid`} className="btn btn-sm btn-primary me-2">
          Read
        </Link>
        <Link to={`/getidedit`} className="btn btn-sm btn-primary me-2">
          Edit
        </Link>
        <Link to={`/getiddelete`} className="btn btn-sm btn-danger">Delete</Link>
      </div>
    </div>
  );
}

export default Home;
