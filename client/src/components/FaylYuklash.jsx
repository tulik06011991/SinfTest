import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null); // Fayl holatini saqlash
  const [uploading, setUploading] = useState(false); // Yuklash holatini boshqarish

  // Fayl tanlash funksiyasi
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Faylni yuklash funksiyasi
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Fayl tanlang!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      // Faylni backendga POST so'rovi orqali jo'natish
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Fayl muvaffaqiyatli yuklandi!");
      console.log("Server javobi:", res.data);
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Fayl yuklashda xatolik yuz berdi.");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Word Faylini Yuklash</h2>
      <form onSubmit={handleFileUpload}>
        <input
          type="file"
          accept=".doc,.docx"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Yuklanmoqda..." : "Yuklash"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
