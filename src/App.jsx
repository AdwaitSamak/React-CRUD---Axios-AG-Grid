import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./comps/Create";
import Home from "./comps/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
