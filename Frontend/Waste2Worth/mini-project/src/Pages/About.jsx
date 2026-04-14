import image1 from "../assets/6895997.jpg";

const About = () => {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-sans overflow-x-hidden">

      {/* HERO HEADER */}
      <header className="text-center py-20 mt-[70px] bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold">
          About Us
        </h1>
        <p className="mt-4 text-lg md:text-xl opacity-90">
          Fighting Hunger, Nourishing Communities
        </p>
      </header>

      {/* ABOUT SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">

        {/* TEXT CARD */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-600 leading-relaxed">
            At <strong>Hope Food Bank</strong>, we are dedicated to eliminating hunger and ensuring food security for all. Our mission is to provide nutritious food to families and individuals in need through community partnerships, donations, and volunteers.
          </p>
        </div>

        {/* IMAGE */}
        <div className="flex-1 flex justify-center">
          <img
            src={image1}
            alt="Food donation"
            className="w-full max-w-sm rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
          />
        </div>

      </section>

      {/* MISSION SECTION */}
      <section className="bg-gradient-to-r from-yellow-200 to-yellow-100 py-16 text-center px-6">

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Our Mission
        </h2>

        <p className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
          To create a hunger-free community by distributing food, supporting sustainability, and advocating for policy change.
        </p>

      </section>

      {/* CORE VALUES */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">

        <h2 className="text-3xl font-bold mb-12 text-gray-800">
          Our Core Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* CARD 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition">
            <h3 className="text-xl font-semibold text-red-500 mb-3 border-b pb-2">
              Compassion
            </h3>
            <p className="text-gray-600">
              We serve with kindness and respect.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition">
            <h3 className="text-xl font-semibold text-red-500 mb-3 border-b pb-2">
              Integrity
            </h3>
            <p className="text-gray-600">
              Transparency in everything we do.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition">
            <h3 className="text-xl font-semibold text-red-500 mb-3 border-b pb-2">
              Community
            </h3>
            <p className="text-gray-600">
              Building strong partnerships to fight hunger.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default About;