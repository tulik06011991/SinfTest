
import './App.css'
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Fayl tanlash funksiyasi
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus('');
  };

  // Faylni yuklash funksiyasi
  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadStatus('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('File uploaded successfully!');
    } catch (error) {
      setUploadStatus('File upload failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Upload Your File</h2>
        <form onSubmit={handleFileUpload}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Choose File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Upload File
            </button>
          </div>
          
          {uploadStatus && (
            <div className={`mt-4 text-center font-medium ${uploadStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {uploadStatus}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FileUpload;
