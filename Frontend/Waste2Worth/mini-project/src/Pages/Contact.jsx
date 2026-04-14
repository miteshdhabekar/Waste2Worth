import React from "react";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out to us. We will contact you soon.");
    e.target.reset();
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-orange-100 to-yellow-100 text-gray-800 font-sans overflow-x-hidden">

      {/* HERO HEADER */}
     <header className="text-center py-16 mt-[70px] bg-gradient-to-r from-red-500 via-pink-500 to-red-400 text-white shadow-lg">
  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
    Contact Us
  </h1>
  <p className="mt-4 text-lg md:text-xl opacity-90 max-w-xl mx-auto">
    We’d love to hear from you
  </p>
</header>

      {/* MAIN CONTAINER */}
      <section className="flex justify-center px-4 py-16">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

          {/* LEFT SIDE - INFO */}
          <div className="md:w-1/2 bg-gradient-to-br from-red-400 to-pink-500 text-white p-10 flex flex-col justify-center">
            
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="mb-8 opacity-90">
              Have questions or want to get involved? We’re here to help and connect with you.
            </p>

            <div className="space-y-5 text-sm">

              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p>123 Hope Street, Foodville, CA 90210</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p>(123) 456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>contact@hopefoodbank.org</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">⏰</span>
                <div>
                  <h3 className="font-semibold">Working Hours</h3>
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat - Sun: 10:00 AM - 4:00 PM</p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="md:w-1/2 p-10">

            <h2 className="text-2xl font-bold mb-6 text-gray-700">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              <input
                type="email"
                placeholder="Your Email"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-red-400 text-white py-3 rounded-lg font-semibold hover:bg-red-500 transition"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;