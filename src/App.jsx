import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./comps/Create";
import Home from "./comps/Home";
import Update from "./comps/Update";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/update/:id" element={<Update />} />
        {/* we will pass an id so that we can update the record on that id */}
        {/* <Route path="/read/:id" element={<Read />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
