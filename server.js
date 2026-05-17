import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import adminrouter from "./routes/SuperAdmin.js";
import locationRouter from "./routes/locationRoute.js";
import UserRoute from "./routes/UserRoute.js";
import hospitalrouter from "./routes/HospitalRoute.js";
import departmentRouter from "./routes/departmentRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import subDepartmentRoutes from "./routes/subDepartmentRoute.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/HMS-DB";

const getMongoUri = (uri) => {
  const separator = uri.includes("?") ? "&" : "?";

  if (uri.includes("retryWrites=")) {
    return uri.replace(/retryWrites=(true|false)/i, "retryWrites=false");
  }

  return `${uri}${separator}retryWrites=false`;
};

app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.use("/admin", adminrouter);
app.use("/locations", locationRouter);
app.use("/user", UserRoute);
app.use("/hospital", hospitalrouter);
app.use("/department", departmentRouter);

app.use("/doctor", doctorRouter);

app.use("/sub-department", subDepartmentRoutes);
app.use("/appointment", appointmentRoutes);

mongoose
  .connect(getMongoUri(MONGODB_URI))
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port number: ${PORT}`);
});
