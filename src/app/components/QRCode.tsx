// src/components/FileUploadQR.jsx
import React, { useState } from "react";
import { QRCode } from "react-qrcode-logo"; // alternative modern library

export default function FileUploadQR() {
  const [fileURL, setFileURL] = useState("");
  const [qrVisible, setQrVisible] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the uploaded file (local preview)
      const url = URL.createObjectURL(file);
      setFileURL(url);
      setQrVisible(true);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload File to Generate QR</h1>

      <input type="file" onChange={handleFileChange} className="mb-4" />

      {qrVisible && (
        <div className="mt-6 text-center">
          <h2 className="font-semibold mb-2">Your QR Code:</h2>
          <QRCode value={fileURL} size={200} />
          <div className="mt-4">
            <a
              href={fileURL}
              target="_blank"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Open File
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
