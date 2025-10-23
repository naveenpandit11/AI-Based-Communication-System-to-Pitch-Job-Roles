const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
require("dotenv").config();

const profileRoutes = require("./routes/profileRoutes");
const userLogRoutes = require("./routes/userLogRoutes");
const jobRoutes = require("./routes/jobRoutes");
const emailRoutes=require("./routes/emailRoutes");

const app = express();
connectDB();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/user-profile", profileRoutes);
app.use("/api/user-log", userLogRoutes);
app.use("/api/user", userLogRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/emails",emailRoutes);

app.listen(7001, () => console.log("Backend running on http://localhost:7001"));
