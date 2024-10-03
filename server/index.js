const expres = require('express')
const app = expres()
const mongoose = require('mongoose');




// MongoDB ga ulanish
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/quizDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});