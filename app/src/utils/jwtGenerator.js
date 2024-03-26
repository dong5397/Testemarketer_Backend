import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import express from "express";
const router = express.Router();

// jwt 생성공장 회원가입에서 사용됨
const jwtGenerator = (user_id) => {
  const payload = {
    user: {
      id: user_id,
    },
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
};

export default jwtGenerator;
