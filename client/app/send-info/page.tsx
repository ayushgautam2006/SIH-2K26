"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/dash_user/DashboardLayout";
import { Send, MapPin, Upload, Phone, User, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function SendInfoPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    latitude: "",
    longitude: "",
    notes: "",
  });
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error" | "loading" | null; message: string }>({
    type: null,
    message: "",
  });

  // Access browser geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setStatus({ type: "error", message: "Geolocation is not supported by your browser." });
      return;
    }

    setStatus({ type: "loading", message: "Detecting location..." });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setStatus({ type: "success", message: "Location detected successfully!" });
        // Clear success message after 2s
        setTimeout(() => setStatus({ type: null, message: "" }), 2000);
      },
      (error) => {
        console.error("Location error:", error);
        setStatus({ type: "error", message: "Unable to retrieve location. Please type manually." });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Convert uploaded image to Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (limit to 5MB for base64)
    if (file.size > 5 * 1024 * 1024) {
      setStatus({ type: "error", message: "Image exceeds 5MB size limit." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageFile(base64String);
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, mobileNumber, latitude, longitude, notes } = formData;

    if (!name || !mobileNumber || !latitude || !longitude) {
      setStatus({ type: "error", message: "Please fill out all required fields." });
      return;
    }

    setStatus({ type: "loading", message: "Submitting report to coordination command..." });

    try {
      const response = await fetch("http://localhost:5000/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobileNumber,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          notes,
          image: imageFile, // base64 string
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({ type: "success", message: "Incident information submitted and logged to MongoDB successfully!" });
        // Reset form
        setFormData({
          name: "",
          mobileNumber: "",
          latitude: "",
          longitude: "",
          notes: "",
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        setStatus({ type: "error", message: result.error || "Failed to submit incident information." });
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus({ type: "error", message: "Network connection to database API failed." });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight uppercase mb-2">
            Send Information
          </h2>
          <p className="text-slate-500 text-xs">
            Report local incidents, damage, or resource needs directly to the coordination command center.
          </p>
        </div>

        {/* Status Messages */}
        {status.type && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-start gap-3 transition-all duration-300 animate-pulse ${
              status.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-800"
                : status.type === "error"
                ? "bg-red-500/10 border border-red-500/30 text-red-800"
                : "bg-blue-500/10 border border-blue-500/30 text-blue-800"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <div className="text-xs font-semibold uppercase tracking-wider">{status.message}</div>
          </div>
        )}

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="neu-flat p-8 rounded-3xl space-y-6">
          {/* Name & Mobile Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Full Name <span className="text-red-500">*</span>
              </label>
              <div className="neu-sunken neu-sunken-focus rounded-xl flex items-center px-3 py-2.5">
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-transparent border-none outline-none text-sm placeholder-slate-400 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="neu-sunken neu-sunken-focus rounded-xl flex items-center px-3 py-2.5">
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mobileNumber: e.target.value }))}
                  className="w-full bg-transparent border-none outline-none text-sm placeholder-slate-400 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Coordinates Detect and Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Coordinates <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider neu-flat-interactive cursor-pointer text-slate-600 hover:text-emerald-700"
              >
                <MapPin className="h-3.5 w-3.5" /> Auto-Detect
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="neu-sunken neu-sunken-focus rounded-xl flex items-center px-3 py-2.5">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude (e.g. 28.6139)"
                  value={formData.latitude}
                  onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value }))}
                  className="w-full bg-transparent border-none outline-none text-sm placeholder-slate-400 font-medium"
                  required
                />
              </div>
              <div className="neu-sunken neu-sunken-focus rounded-xl flex items-center px-3 py-2.5">
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude (e.g. 77.2090)"
                  value={formData.longitude}
                  onChange={(e) => setFormData((prev) => ({ ...prev, longitude: e.target.value }))}
                  className="w-full bg-transparent border-none outline-none text-sm placeholder-slate-400 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Upload Image Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Incident Photograph
            </label>
            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-slate-100/50 transition-all">
              {imagePreview ? (
                <div className="relative group rounded-xl overflow-hidden shadow-md w-full max-h-48 flex justify-center bg-black">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="max-h-48 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg p-1.5 text-xs font-bold uppercase tracking-wider shadow"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-full neu-sunken text-slate-400">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-slate-500 font-semibold">
                      Drag image here or click to browse
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">JPG, PNG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider neu-flat-interactive cursor-pointer text-slate-600"
                  >
                    Select File
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Additional Notes
            </label>
            <div className="neu-sunken neu-sunken-focus rounded-xl p-3">
              <textarea
                placeholder="Describe the incident, status, severity, or immediate requirements..."
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="w-full bg-transparent border-none outline-none text-sm placeholder-slate-400 font-medium resize-none text-foreground"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl neu-green-flat text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform cursor-pointer"
            submit-btn=""
          >
            <Send className="h-4 w-4" />
            <span>Submit Report</span>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
