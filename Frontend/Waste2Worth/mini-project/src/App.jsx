// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Footer from "./Components/Footer";
import Blog from "./Footer_Pages/Blog";
import Story from "./Footer_Pages/Story";
import Store from "./Pages/Store";
import DonateForm from "./Components/DonateForm";
import UserPanel from "./Pages/UserPanel";
import AdminPanel from "./Pages/AdminPanel";
import NGOPanel from "./Pages/NGOPanel"; // ✅ Add this import
import ChatBot from "./Components/chatbot/Chatbot";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();

  const hideNavFooterRoutes = ["/AdminPanel", "/userdash", "/NGOPanel"];
  const hideChatbotRoutes   = ["/AdminPanel", "/userdash", "/NGOPanel"];

  const hideNavFooter = hideNavFooterRoutes.includes(location.pathname);
  const hideChatbot   = hideChatbotRoutes.includes(location.pathname);

  return (
    <div>
      {!hideNavFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/store" element={<Store />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/story" element={<Story />} />
        <Route path="/donateform" element={<DonateForm />} />
        <Route path="/userdash" element={<UserPanel />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="/NGOPanel" element={<NGOPanel />} /> {/* ✅ Add this route */}
      </Routes>

      {!hideNavFooter && <Footer />}
      {!hideChatbot && <ChatBot />}
    </div>
  );
}

export default AppWrapper;
