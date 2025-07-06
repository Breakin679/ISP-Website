import React from "react";
import { FaRocket, FaLock, FaHeadset } from "react-icons/fa";

const Fiber = () => {
  return (
    <main className="pt-24 bg-white text-gray-900">
      
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Fast Fiber Internet
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl mb-8">
          Reliable, fast fiber internet for  homes and businesses. Enjoy stable speeds and local support.
        </p>
        <button className="bg-white text-pink-600 font-semibold px-8 py-3 rounded-md shadow hover:bg-gray-100 transition">
          Explore Plans
        </button>
      </section>

      {/* Key Advantages */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Why Choose Our Fiber
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
            <FaRocket className="text-pink-600 w-10 h-10 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Consistent Speeds</h3>
            <p className="text-gray-600">
              Enjoy up to 100 Mbps download/upload, perfect for streaming, work, and gaming.
            </p>
          </div>
          <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
            <FaLock className="text-pink-600 w-10 h-10 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
            <p className="text-gray-600">
              Transparent pricing, no surprise charges, and flexible monthly plans.
            </p>
          </div>
          <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
            <FaHeadset className="text-pink-600 w-10 h-10 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Local Support</h3>
            <p className="text-gray-600">
              support team available 7 days a week.
            </p>
          </div>
        </div>
      </section>

      {/* Plan Showcase */}
      <section className="bg-gray-50 py-16 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Fiber Plans
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Fiber Basic",
              speed: "20 Mbps",
              price: "- $/mo",
              perks: ["100 GB Monthly Quota", "Free Router Rental"],
            },
            {
              title: "Fiber Plus",
              speed: "50 Mbps",
              price: "- $/mo",
              perks: ["300 GB Monthly Quota", "Priority Support"],
            },
            {
              title: "Fiber Max",
              speed: "100 Mbps",
              price: "- $/mo",
              perks: ["600 GB Monthly Quota", "Unlimited Night Traffic"],
            },
          ].map((plan, i) => (
            <div key={i} className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition">
              <h3 className="text-2xl font-semibold mb-2 text-center">{plan.title}</h3>
              <p className="text-4xl font-bold text-center mb-4">{plan.price}</p>
              <p className="text-center text-gray-600 mb-4">{plan.speed}</p>
              <ul className="mb-6 space-y-2">
                {plan.perks.map((perk, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-2 h-2 bg-pink-600 rounded-full mr-2" />
                    {perk}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition">
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Installation Steps */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
          Easy Installation in 3 Steps
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {[
            { step: 1, label: "Request Service" },
            { step: 2, label: "Schedule Installation" },
            { step: 3, label: "Enjoy Fiber Internet" },
          ].map((s) => (
            <div key={s.step} className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center bg-pink-600 text-white rounded-full font-bold">
                {s.step}
              </div>
              <p className="text-lg font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-16 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready for Reliable Fiber?
        </h2>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Join thousands of homes and businesses enjoying fast, stable internet.
        </p>
        <button className="bg-pink-600 text-white font-semibold px-8 py-3 rounded-md shadow hover:bg-pink-700 transition">
          Get Started
        </button>
      </section>
    </main>
  );
};

export default Fiber;
