import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./comps/Create";
import Home from "./comps/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
