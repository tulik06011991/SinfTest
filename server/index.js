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
const fanlarBazasi = require('./routes/fanlarBazasi')
const fanOlish = require('./routes/fanlarOlish')
const auth  = require('./routes/auth')
const javob = require('./routes/Javoblar')
const adminFan = require('./routes/fanlarYasash')
const hammasi = require('./routes/hammasi')// questionRoutes'ni import qilish
const cors = require("cors")
const path = require('path');




app.use(express.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', questionRoutes)
app.use('/api', quizRoutes);
app.use('/api',  admin);
app.use('/api',  admins)
app.use('/api',  adminPut)
app.use('/api',  adminDel)
app.use('/api', fanlarBazasi)
app.use('/api', fanOlish)
app.use('/api', auth)
app.use('/api', javob)
app.use('/admin', adminFan)
app.use('/admin', hammasi)


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
