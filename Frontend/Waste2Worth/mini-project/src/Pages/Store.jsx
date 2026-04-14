import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

// Assuming these assets are in your project
import organic from "../assets/organic-compost.jpg";
import liquid from "../assets/liquid-compost.jpg";
import bio from "../assets/bio-compost.jpeg";

const products = [
  {
    id: 1,
    name: "Organic Compost",
    description: "Premium soil conditioner made from 100% recycled forest and food waste.",
    price: 199,
    image: organic,
    tag: "Best Seller"
  },
  {
    id: 2,
    name: "Liquid Compost Tea",
    description: "A potent nutrient-rich liquid brew designed for rapid root absorption.",
    price: 149,
    image: liquid,
    tag: "Eco Friendly"
  },
  {
    id: 3,
    name: "Biofertilizer Mix",
    description: "Probiotic soil mix enhanced with nitrogen-fixing microbes for plant growth.",
    price: 249,
    image: bio,
    tag: "New Arrival"
  },
];

const Store = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const [paymentFile, setPaymentFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    quantity: 1,
  });

  const handleBookClick = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const totalPrice = formData.quantity * selectedProduct.price;

    const bookingData = {
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      productName: selectedProduct.name,
      quantity: formData.quantity,
      totalPrice,
    };

    try {
      // await axios.post("http://localhost:8080/api/bookings", bookingData);
      setPaymentAmount(totalPrice);
      setShowPayment(true);
      setShowForm(false);
    } catch (error) {
      alert("Booking failed");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPaymentFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

 const handlePaymentSubmit = async () => {
  if (!paymentFile) {
    alert("Please upload payment screenshot");
    return;
  }

  // Use FormData to send both text and the image file
  const data = new FormData();
  data.append("customerName", formData.name);
  data.append("email", formData.email);
  data.append("phone", formData.phone);
  data.append("address", formData.address);
  data.append("productName", selectedProduct.name);
  data.append("quantity", formData.quantity);
  data.append("totalPrice", paymentAmount);
  data.append("image", paymentFile); // The screenshot file

  try {
    await axios.post("http://localhost:8080/api/bookings/submit", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    setShowPayment(false);
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setPreview(null);
      setPaymentFile(null);
    }, 4000);
  } catch (error) {
    console.error("Payment submission failed:", error);
    alert("Submission failed. Please try again.");
  }
};

  const upiId = "eco-store@upi"; // Replace with real
  const upiUrl = `upi://pay?pa=${upiId}&pn=EcoStore&am=${paymentAmount}&cu=INR`;

  return (
    <div className="min-h-screen bg-[#F7F9F7] font-sans text-slate-900 pb-20 mt-40">
      {/* Hero Header */}
      <div className="bg-white border-b border-green-100 py-12 px-6 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-tight">
          🌿 Eco<span className="text-green-600">Store</span>
        </h1>
        <p className="mt-3 text-slate-500 max-w-lg mx-auto text-lg">
          Transform your garden with premium, recycled organic fertilizers delivered to your doorstep.
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {product.tag}
              </span>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-slate-800">{product.name}</h2>
                <span className="text-xl font-black text-green-600">₹{product.price}</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {product.description}
              </p>
              <button
                onClick={() => handleBookClick(product)}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-100"
              >
                Purchase Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md relative border border-white">
            <button
              onClick={closeForm}
              className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-800">Checkout</h2>
              <p className="text-slate-400 text-sm">Order: {selectedProduct.name}</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input name="name" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none" placeholder="John Doe" onChange={handleChange} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
                   <input type="email" name="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none" placeholder="j@gmail.com" onChange={handleChange} required />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone</label>
                   <input name="phone" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none" placeholder="9988..." onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Shipping Address</label>
                <textarea name="address" rows="2" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none" placeholder="Street, City, Zip" onChange={handleChange} required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Quantity (Units)</label>
                <input type="number" name="quantity" min="1" defaultValue="1" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none" onChange={handleChange} />
              </div>

              <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 mt-4">
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-green-950/30 backdrop-blur-md">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center w-full max-w-md border border-white">
            <h2 className="text-2xl font-black text-slate-800 mb-1">Secure Payment</h2>
            <p className="text-slate-400 text-sm mb-6">Scan and pay via any UPI app</p>

            <div className="bg-green-50 p-4 rounded-3xl inline-block mb-6 border border-green-100">
              <QRCodeCanvas value={upiUrl} size={180} />
            </div>

            <div className="mb-6">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Payable</p>
              <p className="text-4xl font-black text-green-600">₹{paymentAmount}</p>
            </div>

            <div className="relative group mb-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-slate-200 rounded-2xl py-6 group-hover:border-green-400 transition-colors">
                 <p className="text-slate-500 text-sm font-medium">Click to upload screenshot</p>
              </div>
            </div>

            {preview && (
              <img src={preview} className="h-32 mx-auto mb-6 rounded-xl border-2 border-green-200 shadow-lg object-cover" />
            )}

            <button onClick={handlePaymentSubmit} className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-all">
              Confirm Transaction
            </button>
          </div>
        </div>
      )}

      {/* THANK YOU OVERLAY */}
      {showThankYou && (
        <div className="fixed inset-0 z-[60] flex justify-center items-center bg-white/80 backdrop-blur-xl animate-in zoom-in duration-500">
          <div className="text-center">
            <div className="text-7xl mb-4 animate-bounce">🌱</div>
            <h2 className="text-4xl font-black text-green-900">Order Successful!</h2>
            <p className="text-slate-500 mt-2">Your plants are going to love this.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;