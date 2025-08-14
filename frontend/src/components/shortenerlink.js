


import React, { useState } from "react";

function ShortenedLinks({ links }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!links || links.length === 0) return null;

  const handleCopy = (link, idx) => {
    navigator.clipboard.writeText(link);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-4">
      {links.map((linkObj, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-lg border border-gray-100 transition-all"
        >
          <div className="flex-1 mb-2 md:mb-0">
            <p className="text-gray-500 text-xs">
              Original:{" "}
              <span className="break-all">{linkObj.original || "N/A"}</span>
            </p>
            <a
              href={linkObj.short}
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 font-medium hover:underline break-all text-lg"
            >
              {new URL(linkObj.short).pathname}
            </a>
          </div>
          <button
            onClick={() => handleCopy(linkObj.short, index)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              copiedIndex === index
                ? "bg-green-500 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {copiedIndex === index ? "Copied!" : "Copy"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ShortenedLinks;
