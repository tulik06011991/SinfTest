const expres = require('express')
const app = expres()
const mongoose = require('mongoose');
require('dotenv').config()


app.use(express.json());

// Routes
app.use('/api/questions', questionRoutes);

// MongoDB ga ulanish
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL,);
        console.log('MongoDB Atlas bilan ulanish o\'rnatildi');
    } catch (error) {
        console.error('MongoDB Atlas bilan ulanishda xato:', error.message);
        process.exit(1); // Xato bo'lsa serverni to'xtatadi
    }
};

// MongoDB ulanishini chaqirish
connectDB()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});