import { Link } from "react-router-dom";

import bgimg from "../../src/assets/aabg.png";
import img2 from "../assets/mealhome.png";
import icon1 from "../assets/icon-1.webp";
import icon2 from "../assets/icon-2.webp";
import icon3 from "../assets/icon-3.webp";
import icon4 from "../assets/icon-4.webp";

const Home = () => {
  return (
    <div className="w-screen min-h-screen bg-[#eff3ff] font-sans overflow-x-hidden pt-[30px]">

      {/* HERO SECTION */}
      <div className="relative w-full mt-[60px] bg-[#eae8e8]">

        <div className="w-full h-[40rem] bg-[#fcad03] flex justify-end overflow-hidden">
          <img
            src={bgimg}
            alt="background"
            className="h-full w-full md:w-[70%] object-cover"
            style={{
              clipPath: "polygon(34% 0, 100% 0, 100% 100%, 0 100%)"
            }}
          />
        </div>

        <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[90%] md:w-[40%] text-black">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Ending The Line of Hunger
          </h1>

          <p className="mb-6">
            We empower our beneficiaries to break the cycle of poverty and malnutrition
          </p>

          <Link to="/donateform">
            <button className="px-5 py-3 bg-black text-white rounded-xl hover:bg-white hover:text-black transition">
              DONATE NOW 🎗️
            </button>
          </Link>
        </div>
      </div>

     {/* CARDS SECTION */}
<div className="w-full">
  <div className="flex flex-wrap justify-center gap-8 bg-[#6dbfef] w-full py-10 px-4">

    {[
      {
        icon: icon1,
        stat: "27.3",
        title: "Million People",
        desc: "People in India face hunger daily and depend on food support programs."
      },
      {
        icon: icon2,
        stat: "11,11,357",
        title: "Meals Served",
        desc: "Nutritious meals distributed through our food bank initiatives."
      },
      {
        icon: icon3,
        stat: "35.5%",
        title: "Food Waste Reduction",
        desc: "Percentage of surplus food rescued and redirected to those in need."
      },
      {
        icon: icon4,
        stat: "18.7%",
        title: "Households Supported",
        desc: "Families receiving regular food assistance and support."
      }
    ].map((item, index) => (
      <div
        key={index}
        className="w-[280px] md:w-[300px] h-[28rem] bg-white p-5 text-center shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300 flex flex-col justify-between"
      >
        <div>
          <img src={item.icon} alt="" className="w-[90px] mx-auto mb-4" />

          <h2 className="text-2xl font-bold border-b-2 border-red-500 inline-block mb-2">
            {item.stat}
          </h2>

          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            {item.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          {item.desc}
        </p>
      </div>
    ))}
  </div>
</div>

      {/* INFO SECTION */}
      <div className="w-full flex flex-col items-center text-center py-20 px-5">
        <h2 className="text-3xl font-bold">How We Help</h2>

        <img src={img2} alt="" className="h-20 my-4" />

        <p className="text-lg max-w-3xl">
          Whether a meal or a bag of groceries, you can count on the Food Bank to supply nutritious food with dignity.
        </p>
      </div>

      {/* FOOTER */}
      <section className="w-full bg-orange-400 text-black py-10">

        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start px-5 gap-10">

          {/* LEFT */}
          <div className="flex flex-col items-center">
            <pre className="text-red-700 font-bold text-lg text-center">
Waste
  2
Worth
            </pre>

            <p className="text-sm text-center mt-4">
              123 Ravet Road, Pune, India <br />
              Email: admin@brand.com <br />
              Phone: +91-123 456 7890
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex gap-6 text-2xl">
            <a href="#" className="hover:text-blue-500">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-pink-500">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-blue-600">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;