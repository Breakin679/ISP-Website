import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Fiber from "./pages/Subscriptions/Fiber"
import Residential from "./pages/Subscriptions/Residential"
import Corporate from "./pages/Subscriptions/Corporate"
import Full from "./pages/full";


function App() {
  return (
      <Routes>
        <Route path="/" element={<Full />} >
          <Route path="home" element={<Home />} />
          <Route path="about" element={ <About />} />
          <Route path="contact" element={<div className="flex justify-center items-center w-[100%] h-[100vh]"> <Contact /> </div>} />
          <Route path="login" element={<div className="text-white flex justify-center items-center h-[100vh] bg-cover" style={{backgroundImage:"url('../src/assets/Optic.jpg')"}}><Login /></div>} />
          <Route path="signup" element={<Signup />} />
          <Route path="subscriptions/fiber" element={<Fiber />} />
          <Route path="subscriptions/residential" element={<Residential />} />
         <Route path="subscriptions/corporate" element={<Corporate />} />
        </Route>
      </Routes>
  );
}

export default App;
