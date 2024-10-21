import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    // Fan ID va faylni state orqali boshqarish
    const [fanId, setFanId] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    // Fan ID o'zgarishi
    const handleFanIdChange = (e) => {
        setFanId(e.target.value);
    };

    // Fayl tanlanishi
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Formani yuborish
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fanId || !file) {
            setMessage('Iltimos, fanID va faylni kiriting');
            return;
        }

        // FormData yaratish
        const formData = new FormData();
        formData.append('fanId', fanId);
        formData.append('file', file);

        try {
            // POST so'rovi orqali faylni yuklash
            const res = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Fayl muvaffaqiyatli yuklandi!');
        } catch (err) {
            console.error(err);
            setMessage('Faylni yuklashda xatolik yuz berdi!');
        }
    };

    return (
        <div>
            <h2>Fan ID va fayl yuklash</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fanId">Fan ID:</label>
                    <input
                        type="text"
                        id="fanId"
                        value={fanId}
                        onChange={handleFanIdChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="file">Fayl yuklang:</label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                <button type="submit">Yuklash</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;
