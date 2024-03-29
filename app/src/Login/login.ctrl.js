import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { pool } from "../../../app.js";
import jwtGenerator from "../utils/jwtGenerator.js";

const login = async (req, res, next) => {
  try {
    // 1. 본문 요청
    const { email, password } = req.body;

    // 2. 사용자가 존재하는지 확인
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json("존재하지 않는 계정입니다.");
    }

    // 3. 비밀번호 일치 확인
    const validPassword = await bcrypt.compare(password, rows[0].user_password);

    if (!validPassword) {
      return res.status(401).json("비밀번호 혹은 계정이 일치하지 않습니다.");
    }

    // 4. JWT 토큰 발급
    const token = jwtGenerator(rows[0].user_id);

    res.json({
      resultCode: "S-1",
      msg: "성공",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json("Logout success");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

export default { login, logout };
