


import React, { useState } from "react";

function ShortenerForm({ onShorten }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const res = await fetch("http://localhost:8000/shorten", {
      const res = await fetch("https://assessment-b4na.onrender.com/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to shorten URL");
      const data = await res.json();
      onShorten(data.short_url, url);
      setUrl("");
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="url"
        placeholder="Enter your long URL here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all"
      >
        {loading ? "Shortening..." : "✨ Shorten URL"}
      </button>
    </form>
  );
}

export default ShortenerForm;
