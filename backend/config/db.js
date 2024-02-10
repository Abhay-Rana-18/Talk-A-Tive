const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`Mongo db connected sucessfully!: ${conn.connection.host}`.green.underline);
    } catch (error) {
        console.log(error.message.red.bold);
    }
}

module.exports = connectDB;