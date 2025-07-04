import React from "react";
import Optic from "../assets/Optic.jpg";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router";

const Full = () => {
  return (
    <>
      <Navbar/>
<Outlet/>
    </>
  );
};

export default Full;
