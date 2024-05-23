import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonComp from "./ButtonComp";
import { SlOptionsVertical } from "react-icons/sl";
import { IoMdAdd } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import { ModuleRegistry } from "@ag-grid-community/core";
import "./styles.css";
import { Drawer } from "@mui/material";

ModuleRegistry.registerModules([SetFilterModule]);

function Home() {
  let gridApi = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]); // State to store selected rows
  const [showPreferences, setShowPreferences] = useState(false);
  const [userpreferencemap, setUserpreferencemap] = useState({ select: true });
  const [selectedrowid, setSelectedrowid] = useState(null);
  const [data, setData] = useState([]);
  const [isrowselected, setisrowselected] = useState(false);
  const [preferencedrawer, setPreferencedrawer] = useState(false);

  const NameFilterParams = {
    // filterOptions: ["contains"],
    trimInput: true,
    caseSensitive: true,
    buttons: ["apply", "reset", "clear"],
    closeOnApply: true,
  };

  useEffect(() => {
    if (selectedRows && selectedRows.length > 0) {
      let row = selectedRows[0];
      // console.log(row.id);
      setSelectedrowid(row.id);
      setisrowselected(true);
    }
  }, [selectedRows]);

  const colDefs = [
    {
      headerName: "Id",
      field: "id",
      width: 150,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["equals"],
        buttons: ["apply", "reset", "clear"],
        closeOnApply: true,
      },
      floatingFilter: true,
      suppressHeaderMenuButton: true,
      unSortIcon: true,
    },
    {
      headerName: "Name",
      field: "name",
      width: 150,
      filter: "agTextColumnFilter",
      filterParams: NameFilterParams,
      floatingFilter: true,
      suppressHeaderMenuButton: true,
      unSortIcon: true,
    },
    {
      headerName: "Username",
      field: "username",
      width: 150,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains"],
        buttons: ["apply", "reset", "clear"],
        closeOnApply: true,
      },
      floatingFilter: true,
      suppressHeaderMenuButton: true,
      unSortIcon: true,
    },
    {
      headerName: "Email",
      field: "email",
      width: 150,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains"],
        buttons: ["apply", "reset", "clear"],
        closeOnApply: true,
      },
      floatingFilter: true,
      suppressHeaderMenuButton: true,
      unSortIcon: true,
    },
    {
      headerName: "Phone",
      field: "phone",
      width: 150,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      suppressHeaderMenuButton: true,
      filterParams: {
        buttons: ["apply", "reset", "clear"],
        closeOnApply: true,
      },
      unSortIcon: true,
    },
    {
      headerName: "Country",
      field: "country",
      width: 150,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      suppressHeaderMenuButton: true,
      filterParams: {
        buttons: ["apply", "reset", "clear"],
        closeOnApply: true,
      },
      unSortIcon: true,
    },
    {
      headerName: "Actions",
      width: 150,
      cellRenderer: ButtonComp,
      cellRendererParams: (params) => ({ rowid: params.data.id }),
      sortable: false,
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
  }, [colDefs, userpreferencemap]);

  const savepreferences = () => {
    localStorage.setItem(
      "userpreferencemap",
      JSON.stringify(userpreferencemap)
    );
    // setShowPreferences((prev) => !prev);
    setPreferencedrawer(false);
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

  const gridref = useRef(); //gives reference to grid, wont change between renders

  const onFilterTextBoxChanged = useCallback(() => {
    gridref.current.api.setGridOption(
      //uses the grid's ref to filter data in the grid
      "quickFilterText",
      document.getElementById("filter-text-box").value //selects teh input of the filter
    );
  }, []);

  const togglepreferencesdrawer = (newstate) => {
    setPreferencedrawer(newstate); //will open or close depending on true or false of newstate
  };

  const DrawerList = (
    <div className="d-flex gap-2 flex-column align-items-left justify-content-center p-3 m-3">
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
        className="btn btn-outline-dark mt-3"
        data-tooltip-id="save-tooltip"
        data-tooltip-content="Save Preferences"
        data-tooltip-place="bottom"
      >
        Save
        <Tooltip id="save-tooltip" style={{ fontSize: "12px" }} />
      </button>
    </div>
  );

  return (
    <div
      className="d-flex bg-light m-3 p-3 mt-3 flex-column border shadow rounded-3 justify-content-between"
      style={{ height: "100vh-8px" }}
    >
      <div className="d-flex mt-2 flex-row-reverse" style={{ gap: "941px" }}>
        <Link
          to="/create"
          className="btn btn-outline-dark mb-3 btn-sm"
          style={{ width: "30px", height: "30px" }}
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Add Record"
          data-tooltip-place="top"
        >
          <IoMdAdd />
          <Tooltip id="my-tooltip" />
        </Link>
        <div className="pb-3 m-lg-1">
          {/* <span className="m-lg-">Filter: </span> */}
          <input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </div>
      </div>

      <div className="d-flex gap-3 justify-content-end">
        <div
          className="ag-theme-quartz"
          style={{ height: "55vh", width: "92%" }}
        >
          <AgGridReact
            ref={gridref}
            rowData={data}
            columnDefs={visibleColDefs}
            onGridReady={onGridReady}
            rowSelection="single"
            onSelectionChanged={(event) => {
              setSelectedRows(event.api.getSelectedRows());
            }}
            className="w-100 h-100;"
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
        <div className="d-flex flex-column gap-3 ">
          <button
            onClick={() => togglepreferencesdrawer(true)}
            className="btn btn-sm btn-outline-dark"
          >
            <SlOptionsVertical />
          </button>
          <Drawer
            open={preferencedrawer}
            onClose={() => togglepreferencesdrawer(false)}
            anchor="right"
          >
            {DrawerList}
          </Drawer>
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
                className="btn btn-outline-dark mt-3"
                data-tooltip-id="save-tooltip"
                data-tooltip-content="Save Preferences"
                data-tooltip-place="bottom"
              >
                Save
                <Tooltip id="save-tooltip" style={{ fontSize: "12px" }} />
              </button>
            </div>
          )}
        </div>
      </div>
      {isrowselected && (
        <div className="d-flex w-100 h-50 justify-content-center gap-3 pt-3 pb-2">
          <div
            className="border bg-white shadow px-5 pt-3 pb-3 rounded"
            style={{ width: "92%"}}
          >
            <h3>User Details</h3>
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
        </div>
      )}
    </div>
  );
}

export default Home;
