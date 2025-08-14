


import React, { useState } from "react";
import ShortenerForm from "./components/shortenerform";
import ShortenedLinks from "./components/shortenerlink";

function App() {
  const [links, setLinks] = useState([]);

  const handleShorten = (shortUrl, originalUrl) => {
    setLinks((prev) => [{ short: shortUrl, original: originalUrl }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
          🔗 URL Shortener
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Paste your long link below and get a short, shareable URL instantly.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-xl p-6">
        <ShortenerForm onShorten={handleShorten} />
      </div>

      {links.length > 0 && (
        <div className="max-w-2xl mx-auto mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Your Shortened Links
          </h2>
          <ShortenedLinks links={links} />
        </div>
      )}
    </div>
  );
}

export default App;
