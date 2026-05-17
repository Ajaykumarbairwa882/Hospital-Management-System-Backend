import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";

const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/login", login);
UserRouter.post("/forgot-password", forgotPassword);
UserRouter.put("/reset-password", resetPassword);
UserRouter.put("/:id", updateUser);
UserRouter.get("/", getAllUsers);
UserRouter.get("/:id", getUser);
UserRouter.put("/:id", updateUser);
UserRouter.delete("/:id", deleteUser);

export default UserRouter;
