import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { SlOptionsVertical } from "react-icons/sl";
import { IoMdAdd } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import { ModuleRegistry } from "@ag-grid-community/core";
import "./styles.css";
import { Drawer } from "@mui/material";
import colDefs from "../data/colDefs";

ModuleRegistry.registerModules([SetFilterModule]);

function Home() {
  let gridApi = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]); // State to store selected rows
  const [userpreferencemap, setUserpreferencemap] = useState({ select: true });
  const [data, setData] = useState([]);
  const [preferencedrawer, setPreferencedrawer] = useState(false);
  const gridref = useRef(); //gives reference to grid, wont change between renders

  const onGridReady = (params) => {
    gridApi.current = params.api; // Initialize the grid and give access to the grid API
  };

  useEffect(() => {         //fetch data 
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

  useEffect(() => {            //fetching user preferences from local storage
    const storedPreferences = localStorage.getItem("userpreferencemap");
    if (storedPreferences) {
      setUserpreferencemap(JSON.parse(storedPreferences));
    } else {
      const initialPreferences = {}; //initially all column's fields are true, ie. every column must be visible
      colDefs.forEach((column) => {
        initialPreferences[column.field] = true;
      });
      setUserpreferencemap(initialPreferences); //sets initial userpreference map
    }
  }, []);

  const savepreferences = () => {        //saving preferences to local storage
    localStorage.setItem(
      "userpreferencemap",
      JSON.stringify(userpreferencemap)
    );
    // setShowPreferences((prev) => !prev);
    setPreferencedrawer(false);
  };

  const handleOnChangeCheckbox = (field, checked) => {
    //if a checkbox is checked or unchecked, it sets it in the userpreference map
    setUserpreferencemap((prevPreferences) => ({
      ...prevPreferences,
      [field]: checked,
    }));
  };

  const visibleColDefs = colDefs.filter(
    //filter those columns 3for whom the checkbox is selected, ie. userpreference map's field for that columns is true
    (column) => userpreferencemap[column.field] === true
  );

  const onFilterTextBoxChanged = useCallback(() => {    //updates quick filter based on changes in 'filter-text-box'
    gridref.current.api.setGridOption(
      //uses the grid's ref to filter data in the grid
      "quickFilterText",
      document.getElementById("filter-text-box").value //selects teh input of the filter
    );
  }, []);

  const togglepreferencesdrawer = (newstate) => {
    setPreferencedrawer(newstate); //will open or close depending on true or false of newstate
  };

  const DrawerList = //contents fo the drawer   --- preferences drawer
    (
      <div className="d-flex gap-2 flex-column align-items-left justify-content-center p-3 m-3">
        <h4>Show Columns</h4>
        {colDefs.map((column) => (
          <label key={column.headerName.toLowerCase()}>
            <input
              type="checkbox"
              checked={userpreferencemap[column.field]} //initially all checkboxes checked.
              disabled={column.headerName === "Actions"}
              onChange={(e) =>
                handleOnChangeCheckbox(column.field, e.target.checked)
              }
            />
            {column.headerName}
          </label>
        ))}
        <button // save preferences button
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
      style={{ height: "80%" }}
    >
      <div className="d-flex mt-2 flex-row-reverse" style={{ gap: "941px" }}>
        <Link                         //create button
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
          <input // quick filter
            type="text"
            id="filter-text-box"      //will use this id to retrieve current value in input and filter 
            placeholder=" Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </div>
      </div>

      <div className="d-flex gap-3 justify-content-end">
        <div
          className="ag-theme-quartz"
          style={{ height: "55vh", width: "92%" }}
        >
          <AgGridReact                              //grid
            ref={gridref}      //giving reference to grid
            rowData={data}
            columnDefs={visibleColDefs}
            onGridReady={onGridReady} //when grid is initialized, params is argument in onGridReady function, it has access to grid's api        
            rowSelection="single"
            onCellClicked={(event) => {
              if (event.colDef.headerName !== "Actions") {
                setSelectedRows([event.data]);
              }
            }}
            className="w-100 h-100;"
            pagination={true}
            paginationAutoPageSize={true}
            defaultColDef={{ flex: 1 }}    //all columns adjust their width equally
          />
        </div>
        
        <div className="d-flex flex-column gap-3 ">
          <button             //preferences wala button, on click krne pe drawer khulega
            onClick={() => togglepreferencesdrawer(true)}
            className="btn btn-sm btn-outline-dark"
          >
            <SlOptionsVertical />           
          </button>

          <Drawer
            open={preferencedrawer} //is true, it will open
            onClose={() => togglepreferencesdrawer(false)} //sets preferencedrawer to false, close drawer
            anchor="right"
          >
            {DrawerList}          
            {/* will render drawerlist which is the checkboxes */}
          </Drawer>
        </div>
      </div>
      
      {selectedRows.length !== 0 && (
        <div className="d-flex justify-content-center pt-3 pb-2">
          <div className="border bg-white rounded px-4 py-3" style={{ width: "92%" }}>
              <h3>User Details</h3>
              {Object.keys(selectedRows[0]).map((key) => ( // Iterate through keys of selected row
                <div key={key} className="mb-2">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}: {selectedRows[0][key]}</strong> {/* Display each key and its corresponding value */}
           </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
}

export default Home;
