import React, { useState } from "react";


const ContactPage = () => {
  return (
     <main className="mt-30 p-14 text-gray-900">
    <div className="max-w-xl w-full mx-auto py-4 px-8 bg-gray-600 rounded-lg shadow-md">
      <h2 className="text-xl text-center text-pink-600 font-bold mb-6">
        Contact Us
      </h2>
      <form action="">
        <div className="mb-4">
          <label
            htmlFor=""
            className="block text-white text-sm font-semibold mb-2"
          >
            Your Name
          </label>
          <input
            placeholder="Mary Jane"
            className="w-full px-3 py-2 border rounded-lg bg-gray-500 focus:border-blue-500"
            required
            type="text"
          ></input>
        </div>
        <div>
          <label
            className="block text-white text-sm font-semibold mb-2"
            htmlFor=""
          >Your Email</label>
          <input
            placeholder="mary@example.com"
            className="w-full px-3 py-2 border rounded-lg bg-gray-500 focus:border-blue-500"
            required
            type="text"
          ></input>
        </div>
        <div>
          <label
            className="block text-white text-sm font-semibold mb-2"
            htmlFor=""
          >Your Message</label>
          <textarea rows='4'
            placeholder="Type your message here..."
            className="w-full px-3 py-2 border rounded-lg bg-gray-500 focus:border-blue-500"
            required
            type="text"
          ></textarea>
        </div>
        <div className="flex justify-end mt-6">
          <button type="submit" className="bg-pink-600 text-white font-semibold px-4 py-1 rounded-lg hover:pink-700 focus:outline-blue-400">Send</button>
        </div>
      </form>
    </div>
    </main>
  );
};

export default ContactPage;
