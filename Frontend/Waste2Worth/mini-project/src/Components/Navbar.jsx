import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-md">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <div className="text-lg font-bold leading-tight text-black">
          Waste<br />2<br />Worth
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <li><Link to="/" className="hover:text-red-500 transition">Home</Link></li>
          <li><Link to="/about" className="hover:text-red-500 transition">About</Link></li>
          <li><Link to="/contact" className="hover:text-red-500 transition">Contact</Link></li>
          <li><Link to="/store" className="hover:text-red-500 transition">Store</Link></li>
          <li><Link to="/userdash" className="hover:text-red-500 transition">User Panel</Link></li>
        </ul>

        {/* Buttons (Desktop) */}
        <div className="hidden md:flex gap-3">
          <Link to="/login">
            <button className="px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
              Register
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="text-2xl">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-6 pb-4 shadow-md">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
            <li><Link to="/store" onClick={() => setOpen(false)}>Store</Link></li>
            <li><Link to="/userdash" onClick={() => setOpen(false)}>User Panel</Link></li>
          </ul>

          <div className="flex gap-3 mt-4">
            <Link to="/login" onClick={() => setOpen(false)}>
              <button className="px-4 py-2 border border-black rounded-md w-full">
                Login
              </button>
            </Link>
            <Link to="/register" onClick={() => setOpen(false)}>
              <button className="px-4 py-2 bg-black text-white rounded-md w-full">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;