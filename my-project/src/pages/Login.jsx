import React from "react";
import { Link } from "react-router-dom";

const Login = () => (
  <div className="mt-12">
    <div className="bg-slate-800/30 border border-slate-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-lg relative">
      <h1 className="text-4xl font-bold text-center mb-6">Login</h1>
      <form>
        <div className="relative my-4">
          <input
            type="text"
            className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300"
            placeholder="Username"
            required
          />
        </div>
        <div className="relative my-4">
          <input
            type="password"
            className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300"
            placeholder="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full mt-6 mb-4 text-[18px] rounded bg-blue-500 py-2 hover:bg-blue-600 transition-colors duration-300"
        >
          Login
        </button>
      </form>
      <div className="text-center mt-2 text-sm text-white">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-400 hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  </div>
);

export default Login;
