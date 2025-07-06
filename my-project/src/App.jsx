import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Fiber from "./pages/Subscriptions/Fiber"
import Residential from "./pages/Subscriptions/Residential"
import Corporate from "./pages/Subscriptions/Corporate"
import Full from "./pages/full";
import Locations from "./pages/Locations";
import AuthForm from "./pages/AuthForm"; 


function App() {
  return (
      <Routes>
        <Route path="/" element={<Full />} >
          <Route path="home" element={<Home />} />
          <Route path="about" element={ <About />} />
          <Route path="locations" element={<Locations/>} />
          <Route path="contact" element={<div className="flex justify-center items-center w-[100%] h-[100vh]"> <Contact /> </div>} />
          <Route path="login" element={<div className="text-white flex justify-center items-center h-[100vh] bg-cover" style={{backgroundImage:"url('../src/assets/World.jpg')"}}><AuthForm /></div>} />
          <Route path="signup" element={<div className="text-white flex justify-center items-center h-[100vh] bg-cover" style={{backgroundImage:"url('../src/assets/World.jpg')"}}><AuthForm /></div>} />
          <Route path="subscriptions/fiber" element={<Fiber />} />
          <Route path="subscriptions/residential" element={<Residential />} />
          <Route path="subscriptions/corporate" element={<Corporate />} />
         
        </Route>
      </Routes>
  );
}

export default App;
