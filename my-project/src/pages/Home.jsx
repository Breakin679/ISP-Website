import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="pt-14  bg-white text-gray-900">
      <div className="mx-auto">
        {/* Hero Section */}
        <section
          id="hero"
          className="min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-r from-sky-600 to-indigo-700 bg-cover text-white text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to MyISP — Your Trusted Internet Provider
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mb-8">
            Lightning fast, reliable internet tailored for your home and
            businesses
          </p>
          <button className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition">
            Get Started
          </button>
        </section>

        {/* Services Overview */}
        <section id="services" className="w-full py-16 px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Fiber Network</h3>
              <p>
                Blazing fast fiber optic internet for ultra-reliable
                connectivity.
              </p>
            </div>
            <div className="p-6 border rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Residential</h3>
              <p>
                Affordable plans for your home with great speed and service.
              </p>
            </div>
            <div className="p-6 border rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Corporate</h3>
              <p>
                Custom business solutions with guaranteed uptime and support.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section
          id="why-us"
          className="w-full bg-gray-100 py-16 px-4 text-center"
        >
          <h2 className="text-3xl font-bold mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-indigo-700">
            <div>
              <h3 className="text-xl font-semibold mb-2">Reliability</h3>
              <p>99.9% uptime keeps you connected all the time.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Speed</h3>
              <p>Fast speeds up to 1 Gbps for all your needs.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Support</h3>
              <p>24/7 customer support ready to help.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Affordable</h3>
              <p>Competitive pricing with no hidden fees.</p>
            </div>
          </div>
        </section>

        {/* Plans & Pricing */}
        <section id="plans" className="w-full py-16 px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Plans & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Basic Plan",
                price: "$24.99 / month",
                features: ["Up to 15 Mbps", "Unlimited Data", "24/7 Support"],
              },
              {
                title: "Standard Plan",
                price: "$34.99 / month",
                features: ["Up to 20 Mbps", "Unlimited Data", "24/7 Support"],
              },
              {
                title: "Premium Plan",
                price: "$44.99 / month",
                features: [
                  "Up to 25 Mbps",
                  "Unlimited Data",
                  "Priority Support",
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className="p-6 border rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-3xl font-bold mb-4">{plan.price}</p>
                <ul className="mb-4 text-left list-disc list-inside">
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
          <p className="mt-8 text-indigo-600 font-semibold">
            <Link to="/subscriptions/fiber">View all plans & details →</Link>
          </p>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="w-full bg-gray-100 py-16 px-4 text-center"
        >
          <h2 className="text-3xl font-bold mb-10">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The best internet provider I've ever had! Reliable and fast.",
                name: "- Sarah K.",
              },
              {
                quote:
                  "Great customer service and affordable plans. Highly recommend.",
                name: "- Mike D.",
              },
              {
                quote:
                  "Fiber network is super fast and stable. Perfect for my business.",
                name: "- Lina M.",
              },
            ].map((testimonial, i) => (
              <blockquote key={i} className="p-6 border rounded shadow italic">
                "{testimonial.quote}"
                <footer className="mt-4 font-semibold">
                  {testimonial.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* Coverage */}
        <section id="coverage" className="w-full py-16 px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Check Your Coverage</h2>
          <p className="mb-4">
            Enter your ZIP code or address to check availability.
          </p>
          <form className="max-w-sm mx-auto flex gap-2">
            <input
              type="text"
              placeholder="ZIP code or address"
              className="flex-grow px-4 py-2 border rounded-l focus:outline-none"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700 transition"
            >
              Check
            </button>
          </form>
        </section>

        {/* Contact CTA */}
        <section
          id="contact"
          className="w-full bg-gray-100 py-16 px-4 text-center"
        >
          <h2 className="text-3xl font-bold mb-10">Need Help? Contact Us</h2>
          <p className="mb-4">
            Questions? Issues? Our support team is here for you 24/7.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-indigo-800 text-white font-semibold px-8 py-4 rounded-full shadow hover:bg-gray-100 transition"
          >
            Contact Support
          </Link>
        </section>
      </div>
    </main>
  );
};

export default Home;
