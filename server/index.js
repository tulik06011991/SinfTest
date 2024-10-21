const express = require('express'); // express'ni to'g'ri yozish
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const questionRoutes = require('./routes/faylYuklashRoute');
const quizRoutes = require('./routes/savollar');
const admin = require('./routes/adminlar')
const admins = require('./routes/adminlar') 
const adminPut = require('./routes/adminlar') 
const adminDel = require('./routes/adminlar') 
const fanOlish = require('./routes/fanlarOlish')
const auth  = require('./routes/auth')
const javob = require('./routes/Javoblar')
const SavolDelete = require('./routes/SavollarDelete')
const cors = require("cors")
const path = require('path');




app.use(express.json());

// CORS sozlamalari
// app.use(cors({
//   origin: '*', // Frontend React app domeni
//   credentials: true, // Cookie va autentifikatsiya ma'lumotlarini yuborishga ruxsat
//   allowedHeaders: ['Content-Type', 'Authorization'], // Kerakli header'lar ro'yxati
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Ruxsat etilgan metodlar
//   maxAge: 600 // Preflight so'rovlari uchun cache muddatini o'rnatish (10 daqiqa)
// }));
app.use(cors())

app.use(express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', questionRoutes)
app.use('/api', quizRoutes);
app.use('/api',  admin);
app.use('/api',  admins)
app.use('/api',  adminPut)
app.use('/api',  adminDel)

app.use('/api', fanOlish)
app.use('/api', auth)
app.use('/api', javob)


app.use('/admin', SavolDelete)


// MongoDB ga ulanish
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
       
      });
      console.log('MongoDB Atlas bilan ulanish muvaffaqiyatli amalga oshirildi');
    } catch (error) {
      console.error('MongoDB Atlas bilan ulanishda xato:', error);
      process.exit(1);
    }
  };
// MongoDB ulanishini chaqirish
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
