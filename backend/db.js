const mongoose = require("mongoose");
require("dotenv").config();
//const mongoURL="mongodb+srv://job_emails:naveen123@cluster0.15yqtmy.mongodb.net/jobEmails?retryWrites=true&w=majority";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;                         