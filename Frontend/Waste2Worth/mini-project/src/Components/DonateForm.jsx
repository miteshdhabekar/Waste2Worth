import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import "./donateform.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Component to capture map click and update coordinates
const LocationPicker = ({ setCoords }) => {
  useMapEvents({
    click(e) {
      setCoords([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

// Component to programmatically center the map
const CenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13);
  }, [coords, map]);
  return null;
};

const DonateForm = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [coords, setCoords] = useState([19.1667, 74.0333]); // Default: Phaltan
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    foodType: "",
    quantity: "",
    address: "",
    foodDetails: "",
  });

  // Fetch current user location when component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords([latitude, longitude]);
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        }
      );
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("customerEmail", form.email);
    formData.append("foodType", form.foodType);
    formData.append("quantity", form.quantity);
    formData.append("address", form.address);
    formData.append("foodDetails", form.foodDetails);
    formData.append("latitude", coords[0]);
    formData.append("longitude", coords[1]);
    formData.append("donationDate", new Date().toISOString()); // System date
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:8080/api/donations/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      setForm({
        name: "",
        email: "",
        foodType: "",
        quantity: "",
        address: "",
        foodDetails: "",
      });
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4 pt-[100px]">

  <div className="w-full max-w-5xl bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-6 md:p-10 border border-white/30">
    
    <h2 className="text-3xl font-bold text-white text-center mb-8">
      Donate Food
    </h2>

    <div className="grid md:grid-cols-2 gap-8">

      {/* LEFT - FORM */}
      <form id="donateForm" onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="text-white text-sm">Your Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            required
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="text-white text-sm">Your Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            required
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="text-white text-sm">Food Type</label>
          <select
            name="foodType"
            value={form.foodType}
            required
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">--Select--</option>
            <option value="Veg">Veg</option>
            <option value="Non-veg">Non-veg</option>
            <option value="Mixed">Mixed</option>
            <option value="Rotten">Rotten</option>
          </select>
        </div>

        <div>
          <label className="text-white text-sm">Quantity (person)</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            required
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="text-white text-sm">Location Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            required
            placeholder="Enter your location address"
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="text-white text-sm">Food Details</label>
          <textarea
            name="foodDetails"
            rows="2"
            value={form.foodDetails}
            placeholder="Describe the food..."
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-400"
          ></textarea>
        </div>

        <div>
          <label className="text-white text-sm">Upload Food Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-1 text-white"
          />
        </div>

        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          type="submit"
        >
          Submit Donation
        </button>

      </form>

      {/* RIGHT - IMAGE + MAP */}
      <div className="flex flex-col items-center space-y-6">

        {/* Image Preview */}
        {imagePreview && (
          <div className="w-full max-w-sm">
            <img
              src={imagePreview}
              alt="Food Preview"
              className="rounded-xl shadow-lg border border-white/30"
            />
          </div>
        )}

        {/* Map */}
        <div className="w-full max-w-sm">
          <label className="text-white text-sm block mb-2 text-center">
            Click on Map to Change Location
          </label>

          <div className="h-64 w-full border border-white/30 rounded-xl overflow-hidden">
            <MapContainer center={coords} zoom={13} className="h-full w-full">
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CenterMap coords={coords} />
              <LocationPicker setCoords={setCoords} />
              <Marker position={coords} />
            </MapContainer>
          </div>
        </div>

      </div>
    </div>

    {/* Success Message */}
    {showSuccessMessage && (
      <div className="mt-6 text-center text-green-200 font-semibold">
        Your donation was submitted successfully!
      </div>
    )}

  </div>
</div>
  );
};

export default DonateForm;
