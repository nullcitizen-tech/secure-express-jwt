import {
  registerPage,
  loginPage,
  postRegisterPage,
  postLoginPage,
  protectedPage,
} from "../controller/userController.js";
import express from "express";

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Add user to request
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

router.get("/", registerPage);
router.get("/register", registerPage);
router.post("/register", postRegisterPage);
router.get("/login", loginPage);
router.post("/login", postLoginPage);
router.get("/protected", verifyToken, protectedPage);

export default router;
