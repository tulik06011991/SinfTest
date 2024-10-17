import React, { useState, useEffect } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null); // Fayl holatini saqlash
  const [fanId, setFanId] = useState(""); // Fan ID holatini saqlash
  const [fanlar, setFanlar] = useState([]); // Dinamik ravishda fanlar ro'yxatini saqlash
  const [uploading, setUploading] = useState(false); // Yuklash holatini boshqarish
  const [error, setError] = useState(""); // Xatolik holati

  // Fanlar ro'yxatini olish uchun useEffect
  useEffect(() => {
    const fetchFanlar = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/subjectlar");
        setFanlar(res);
        
        // Fanlar ro'yxatini o'rnatish
      } catch (err) {
        setError("Fanlarni olishda xatolik yuz berdi");
      }
    };
    
    fetchFanlar(); // Fanlar ro'yxatini olish
  }, []);
  
  console.log(fanlar);

  // Fayl tanlash funksiyasi
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Fan tanlash funksiyasi
  const handleFanChange = (e) => {
    setFanId(e.target.value);
  };

  // Faylni yuklash funksiyasi
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file || !fanId) {
      alert("Fayl va fanni tanlang!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fanId", fanId); // fanId ni yuborish

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
      setFanId(""); // Fan tanlovini tozalash
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Word Faylini Yuklash</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleFileUpload} className="space-y-4">
        {/* Fan tanlash */}
        <div className="flex flex-col">
          <label htmlFor="fanId" className="font-medium mb-2">
            Fan Tanlang:
          </label>
          <select
            id="fanId"
            value={fanId}
            onChange={handleFanChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={uploading}
          >
            <option value="">Fanni tanlang</option>
            {fanlar.map((fan) => (
              <option key={fan._id} value={fan._id}>
                {fan.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fayl tanlash */}
        <div className="flex flex-col">
          <label htmlFor="file" className="font-medium mb-2">
            Word Faylini tanlang:
          </label>
          <input
            type="file"
            accept=".doc,.docx"
            onChange={handleFileChange}
            disabled={uploading}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Fayl yuklash tugmasi */}
        <div className="text-center">
          <button
            type="submit"
            disabled={uploading}
            className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              uploading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {uploading ? "Yuklanmoqda..." : "Yuklash"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;
