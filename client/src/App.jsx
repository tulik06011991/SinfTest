
import "./App.css"
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
      setIsUploading(true);
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('File uploaded successfully!');
    } catch (error) {
      setUploadStatus('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-300 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Upload Your File</h2>
        
        <form onSubmit={handleFileUpload}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg text-lg font-semibold tracking-wide transition-colors duration-200 hover:from-blue-600 hover:to-indigo-600 focus:outline-none ${isUploading && 'opacity-50 cursor-not-allowed'}`}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>

          {uploadStatus && (
            <div className={`mt-4 text-center font-medium ${uploadStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {uploadStatus}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FileUpload;
