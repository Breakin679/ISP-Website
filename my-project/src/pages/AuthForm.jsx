import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function AuthForm() {
  const location = useLocation();
  // determine initial form based on path
  const initialLogin = location.pathname === "/login";
  const [isLogin, setIsLogin] = useState(initialLogin);

  const saveUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
  };

  return (
    <div className="mt-24 flex justify-center items-center min-h-[60vh]">
      <motion.div
        layout
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-slate-800/30 border border-slate-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-lg relative w-[350px] max-w-full"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl font-bold text-center mb-6 text-white">
                Login
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = e.target.email.value.trim();
                  const password = e.target.password.value;
                  if (!email || !password) return;

                  if (
                    email === "admin@example.com" &&
                    password === "admin1234"
                  ) {
                    saveUser({ email, role: "admin" });
                    window.location.href = "/admin";
                    return;
                  }

                  saveUser({ email, role: "customer" });
                  window.location.href = "/";
                }}
              >
                {/* Email Field */}
                <div className="relative my-4">
                  <input
                    name="email"
                    type="email"
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                    Email
                  </label>
                </div>
                {/* Password Field */}
                <div className="relative my-4">
                  <input
                    name="password"
                    type="password"
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                    Password
                  </label>
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
                <button
                  className="text-blue-400 hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl font-bold text-center mb-6 text-white">
                Sign Up
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const firstName = e.target.firstName.value.trim();
                  const lastName = e.target.lastName.value.trim();
                  const email = e.target.email.value.trim();
                  const phone = e.target.phone.value.trim();
                  const password = e.target.password.value;
                  const confirm = e.target.confirm.value;
                  if (
                    !firstName ||
                    !lastName ||
                    !email ||
                    !password ||
                    password !== confirm
                  )
                    return;

                  saveUser({
                    firstName,
                    lastName,
                    email,
                    phone,
                    role: "customer",
                  });
                  window.location.href = "/";
                }}
              >
                {/* First Name */}
                <div className="relative my-4">
                  <input
                    name="firstName"
                    type="text"
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                    First Name
                  </label>
                </div>
                {/* Last Name */}
                <div className="relative my-4">
                  <input
                    name="lastName"
                    type="text"
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                    Last Name
                  </label>
                </div>
                {/* Email */}
                <div className="relative my-4">
                  <input
                    name="email"
                    type="email"
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                    Email
                  </label>
                </div>
                {/* Phone */}
                <div className="relative my-4">
                  <input
                    name="phone"
                    type="tel"
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                    Phone (optional)
                  </label>
                </div>
                {/* Password */}
                <div className="relative my-4">
                  <input
                    name="password"
                    type="password"
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                    Password
                  </label>
                </div>
                {/* Confirm Password */}
                <div className="relative my-4">
                  <input
                    name="confirm"
                    type="password"
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                    Confirm Password
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full mt-6 mb-4 text-[18px] rounded bg-blue-500 py-2 hover:bg-blue-600 transition-colors duration-300"
                >
                  Sign Up
                </button>
              </form>
              <div className="text-center mt-2 text-sm text-white">
                Already have an account?{" "}
                <button
                  className="text-blue-400 hover:underline"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
