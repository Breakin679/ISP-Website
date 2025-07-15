import React, { useState } from "react";
import { FaWifi, FaTv, FaGamepad } from "react-icons/fa";
import RequestInstallationModal from "../../components/Installation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const plans = [
  {
    title: "Starter",
    price: "$19.99/mo",
    speed: "10 Mbps",
    features: ["Unlimited Data", "Free Installation"],
  },
  {
    title: "Everyday",
    price: "$29.99/mo",
    speed: "15 Mbps",
    features: ["Unlimited Data", "Free Router Rental"],
  },
  {
    title: "Ultimate",
    price: "$49.99/mo",
    speed: "25 Mbps",
    features: ["Unlimited Data", "Priority Support"],
  },
  {
    title: "Pro Gamer",
    price: "$59.99/mo",
    speed: "50 Mbps",
    features: ["Unlimited Data", "Low Latency"],
  },
  {
    title: "Family",
    price: "$79.99/mo",
    speed: "100 Mbps",
    features: ["Unlimited Data", "Multiple Devices"],
  },
  // ...more plans
];

export default function Residential({ locData = {}, subsOptions = {} }) {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");

  const itemsPerPage = 3;
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const currentPlans = plans.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  const openModal = (type) => {
    setInstallType(type);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = (data) => {
    console.log("Installation requested:", data);
    setIsModalOpen(false);
  };

  return (
    <>
      <main className="pt-24 bg-white text-gray-900">
        {/* Hero */}
        <section className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-20 px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Residential Internet Plans
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl mb-8">
            Fast, reliable, and affordable internet for every home—stream, game,
            and browse without limits.
          </p>
          <button
            onClick={() => openModal("Residential")}
            className="bg-white text-teal-600 font-semibold px-8 py-3 rounded-md shadow hover:bg-gray-100 transition"
          >
            View Plans
          </button>
        </section>

        {/* Key Benefits */}
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Why Choose Our Residential Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaWifi className="text-teal-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">
                Blazing Fast Speeds
              </h3>
              <p className="text-gray-600">
                Enjoy speeds up to 500 Mbps to power all your devices
                seamlessly.
              </p>
            </div>
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaTv className="text-teal-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">
                Unlimited Streaming
              </h3>
              <p className="text-gray-600">
                Stream HD and 4K content on multiple screens without buffering.
              </p>
            </div>
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaGamepad className="text-teal-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Lag-Free Gaming</h3>
              <p className="text-gray-600">
                Low latency connections ideal for online gaming and video calls.
              </p>
            </div>
          </div>
        </section>

        {/* Plans & Pricing with pagination */}
        <section className="bg-gray-50 py-16 px-4 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Choose Your Plan
          </h2>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
              {currentPlans.map((plan) => (
                <div
                  key={plan.title}
                  className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition"
                >
                  <h3 className="text-2xl font-semibold mb-2 text-center">
                    {plan.title}
                  </h3>
                  <p className="text-4xl font-bold text-center mb-4">
                    {plan.price}
                  </p>
                  <p className="text-center text-gray-600 mb-4">{plan.speed}</p>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-teal-600 rounded-full mr-2" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openModal("Residential")}
                    className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition"
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
              className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
          <div className="text-center text-sm text-gray-600">
            Page {page + 1} of {totalPages}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is there a data cap?",
                a: "No, all residential plans come with truly unlimited data.",
              },
              {
                q: "Do I need a contract?",
                a: "No long-term contracts—cancel any time with 30 days notice.",
              },
              {
                q: "How soon can I get connected?",
                a: "Most installations are completed within 3–5 business days.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b pb-4">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="text-gray-600 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Upgrade Your Home Internet?
          </h2>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            Get started today and experience a faster, more reliable connection.
          </p>
          <button
            onClick={() => openModal("Residential")}
            className="bg-teal-600 text-white font-semibold px-8 py-3 rounded-md shadow hover:bg-teal-700 transition"
          >
            Sign Up Now
          </button>
        </section>
      </main>

      {/* Installation Modal */}
      <RequestInstallationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        installType={installType}
        locData={locData}
        subsOptions={subsOptions}
        onSubmit={handleSubmit}
      />
    </>
  );
}
