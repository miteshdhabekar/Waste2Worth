import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const UPI_ID = "waste2worth@upi"; 
const STEPS = ["Order Details", "Pay via QR", "Upload Proof"];

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  // States
  const [step, setStep] = useState(0); 
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);

  const { productName, quantity, totalPrice, customerName, email, phone, address } = state || {};

  // Security: Redirect if no state is passed from Store
  useEffect(() => { if (!state) navigate("/store"); }, [state, navigate]);
  if (!state) return null;

  // STEP 1: Create the record in DB (Status: PENDING_PAYMENT)
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8080/api/payment/place-order", {
        customerName, email, phone, address, productName, quantity, totalPrice
      });
      if (res.data.success) {
        setBookingId(res.data.bookingId);
        setStep(1);
      } else {
        setError(res.data.error || "Failed to initiate order.");
      }
    } catch (e) {
      setError("Server connection failed. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
    }
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  // STEP 2: Upload Screenshot & UTR (Status: PENDING_VERIFICATION)
  const handleUploadSubmit = async () => {
    if (!utrNumber || utrNumber.length < 6) {
        setError("Please enter a valid Transaction ID / UTR.");
        return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("utrNumber", utrNumber.trim());
    formData.append("screenshot", screenshot);

    try {
      const res = await axios.post("http://localhost:8080/api/payment/upload-screenshot", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        // Navigate to success page or show success state
        navigate("/payment-success", { 
            state: { productName, totalPrice, bookingId, utrNumber } 
        });
      }
    } catch (e) {
      setError(e.response?.data?.error || "Error uploading proof. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
      
      {/* Progress Stepper */}
      <div className="w-full max-w-md mb-8 flex justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
        {STEPS.map((label, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center bg-slate-50 px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                i <= step ? "bg-emerald-600 text-white" : "bg-white border-2 border-slate-200 text-slate-400"
            }`}>
              {i + 1}
            </div>
            <span className={`text-[10px] mt-2 font-bold uppercase tracking-tight ${i <= step ? "text-emerald-700" : "text-slate-400"}`}>
                {label}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 w-full max-w-md overflow-hidden border border-slate-100">
        
        {/* Step 0: Order Confirmation */}
        {step === 0 && (
          <div className="p-8">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Order Summary</h2>
            <p className="text-slate-500 text-sm mb-6">Confirm your details before paying.</p>
            
            <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Items</span><span className="font-bold">{productName} x {quantity}kg</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Deliver to</span><span className="font-bold text-right truncate w-32">{customerName}</span></div>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800">Total Payable</span>
                    <span className="text-2xl font-black text-emerald-600">₹{totalPrice}</span>
                </div>
            </div>

            <button onClick={handlePlaceOrder} disabled={loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all">
              {loading ? "Generating Order..." : "Proceed to Pay"}
            </button>
          </div>
        )}

        {/* Step 1: Manual UPI Payment */}
        {step === 1 && (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Scan & Pay</h2>
            <p className="text-slate-500 text-sm mb-6">Pay via GPay, PhonePe, or any UPI app.</p>

            <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-6 flex flex-col items-center mb-6">
                <div className="bg-white p-3 rounded-2xl shadow-sm mb-4">
                    {/* In a real app, use the totalPrice in the QR generation if possible */}
                    <img src="/upi-qr.png" alt="UPI QR" className="w-44 h-44 object-contain" />
                </div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Payable Amount</p>
                <p className="text-3xl font-black text-emerald-900">₹{totalPrice}</p>
            </div>

            <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl mb-6">
                <span className="font-mono text-sm font-bold text-slate-700 truncate">{UPI_ID}</span>
                <button onClick={copyUPI} className="text-xs bg-white px-3 py-1.5 rounded-lg font-bold shadow-sm hover:bg-emerald-600 hover:text-white transition-all">
                    {copied ? "Copied!" : "Copy ID"}
                </button>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
              I have paid, Upload Proof
            </button>
          </div>
        )}

        {/* Step 2: Proof Submission */}
        {step === 2 && (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Confirm Payment</h2>
            <p className="text-slate-500 text-sm mb-6">Upload screenshot to verify your order.</p>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">UTR / Transaction ID</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
                  placeholder="Enter 12-digit UTR"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                />
              </div>

              <div 
                onClick={() => fileRef.current.click()}
                className={`group relative border-2 border-dashed rounded-[2rem] p-8 text-center transition-all cursor-pointer ${
                    preview ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-emerald-300"
                }`}
              >
                {preview ? (
                  <div className="relative inline-block">
                    <img src={preview} className="max-h-48 rounded-2xl shadow-md mx-auto" alt="Payment Proof" />
                    <div className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-1 shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">📸</div>
                    <p className="text-slate-600 font-bold">Select Screenshot</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Max size 5MB</p>
                  </div>
                )}
                <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold border border-rose-100 flex items-center gap-2">
                    <span className="text-base">⚠️</span> {error}
                </div>
              )}

              <button 
                onClick={handleUploadSubmit}
                disabled={loading || !screenshot}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 disabled:opacity-50 disabled:bg-slate-300 transition-all active:scale-95"
              >
                {loading ? "Uploading Proof..." : "Submit for Verification"}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-slate-400 text-xs font-medium">
        Secure Manual Payment System • Waste2Worth 
      </p>
    </div>
  );
};

export default PaymentPage;