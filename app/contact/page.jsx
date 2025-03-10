"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("http://localhost:5000/api/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus("Failed to send message.");
    }
  };

  return (
    <div className="bg-gray-50 py-10">
      <section className="max-w-7xl mx-auto rounded-lg space-y-8">
        <h2 className="text-4xl font-extrabold text-center text-[#7FA15A] mb-6">
          Contact Us
        </h2>
        <p className="text-center font-josefin-slab text-lg text-gray-600 mb-8">
          We'd love to hear from you! Please fill out the form below.
        </p>

        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          <div className="flex-1">
            <img
              src="/house.jpg"
              alt="Contact us"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="flex-1 bg-white p-6 shadow-lg rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7FA15A]"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7FA15A]"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7FA15A]"
                  rows="6"
                ></textarea>
              </div>

              <div>
                <button className="w-full p-4 bg-[#7FA15A] text-white rounded-lg hover:bg-green-700">
                  Submit
                </button>
              </div>
            </form>
            {status && <p className="text-center mt-4 text-gray-600">{status}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
