
import "./App.css"
import React, { useState } from "react";
import axios from "axios";
import { FiUploadCloud } from "react-icons/fi";  // Upload icon
import { AiOutlineFile } from "react-icons/ai";  // File icon

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "No file chosen");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    // File upload to the server
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading...");

      // Send POST request to the REST API
      const response = await axios.post("http://localhost:5173//api/questions/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadStatus("File uploaded successfully!");
      console.log("File uploaded:", response.data);

    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Failed to upload file.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Upload Your File
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center">
            <AiOutlineFile className="text-gray-400 text-2xl mr-4" />
            <input
              type="file"
              id="fileInput"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <label htmlFor="fileInput" className="block text-sm text-gray-600 w-full">
              {fileName}
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <FiUploadCloud className="text-white text-xl mr-2" />
            Upload File
          </button>
        </form>

        {uploadStatus && (
          <p className={`text-center mt-4 ${uploadStatus.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {uploadStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;


