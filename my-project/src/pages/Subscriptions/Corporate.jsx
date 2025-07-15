import React from "react";
import { FaBriefcase, FaNetworkWired, FaLifeRing } from "react-icons/fa";
import RequestInstallationModal from "../../components/Installation";
import { useState } from "react";

export default function Corporate({ locData = {}, subsOptions = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");

  const openModal = (type) => {
    setInstallType(type);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = (data) => {
    console.log("Corporate quote requested:", data);
    setIsModalOpen(false);
  };

  return (
    <>
      <main className="pt-24 bg-white text-gray-900">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Enterprise &amp; Corporate Solutions
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl mb-8">
            Tailored, high‑capacity internet and network services designed for
            large organizations.
          </p>
          <button
            onClick={() => openModal("Corporate")}
            className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-md shadow hover:bg-gray-100 transition"
          >
            Get a Quote
          </button>
        </section>

        {/* Features */}
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Why Choose Our Corporate Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaNetworkWired className="text-indigo-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">
                Dedicated Bandwidth
              </h3>
              <p className="text-gray-600">
                Guaranteed speeds and SLAs for mission‑critical operations.
              </p>
            </div>
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaBriefcase className="text-indigo-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Custom SLAs</h3>
              <p className="text-gray-600">
                Tailored service level agreements to meet your uptime and
                support needs.
              </p>
            </div>
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaLifeRing className="text-indigo-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">
                24/7 Priority Support
              </h3>
              <p className="text-gray-600">
                Fast‑track issue resolution with our dedicated enterprise
                support team.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="bg-gray-100 py-16 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Industries We Serve
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              "Banking & Finance",
              "Healthcare",
              "Manufacturing",
              "Education",
              "Government",
              "Retail",
            ].map((industry, i) => (
              <span
                key={i}
                className="bg-white px-4 py-2 rounded-full shadow text-gray-700 hover:bg-indigo-50 transition"
              >
                {industry}
              </span>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">
            What Enterprise Clients Say
          </h2>
          {[
            {
              quote:
                "Their corporate network solution transformed our global operations. Uptime has never been better.",
              author: "— Global Tech Corp",
            },
            {
              quote:
                "Outstanding support and performance. We can’t imagine running our data centers without them.",
              author: "— FinBank International",
            },
          ].map((t, i) => (
            <blockquote key={i} className="italic text-gray-700">
              “{t.quote}”
              <cite className="block mt-4 font-semibold text-indigo-600">
                {t.author}
              </cite>
            </blockquote>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 px-4">
          <p className="text-lg sm:text-xl mb-6">
            Ready to elevate your business connectivity?
          </p>
          <button
            onClick={() => openModal("Corporate")}
            className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-md shadow hover:bg-indigo-700 transition"
          >
            Request Corporate Quote
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
