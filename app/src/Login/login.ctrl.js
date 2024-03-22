import { pool } from "../../../app.js";
import jwt from "jsonwebtoken";

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let { rows } = await pool.query("SELECT * FROM users where email = $1", [
    email,
  ]);

  console.log(rows[0]);

  if (!rows[0].email === email) {
    res.status(403).json("Not Authorized");
  } else {
    try {
      // access Token 발급
      const accessToken = jwt.sign(
        {
          id: rows[0].user_id,
          username: rows[0].username,
          email: rows[0].email,
        },
        process.env.ACCESS_SECRET,
        {
          expiresIn: "1m",
          issuer: "About Tech",
        }
      );

      // refresh Token 발급
      const refreshToken = jwt.sign(
        {
          id: rows[0].user_id,
          username: rows[0].username,
          email: rows[0].email,
        },
        process.env.REFRECH_SECRET,
        {
          expiresIn: "24h",
          issuer: "About Tech",
        }
      );

      // token 전송
      res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
      });

      res.status(200).json("login success");
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

const accesstoken = async (req, res) => {
  const { email, password } = req.body;
  let { rows } = await pool.query("SELECT * FROM users where email = $1", [
    email,
  ]);

  try {
    const token = req.cookies.accessToken;
    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    const userData = rows[0].filter((item) => {
      return item.email === data.email;
    });

    const { password, ...others } = userData;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
};

const refreshToken = async (req, res) => {
  const { email, password } = req.body;
  let { rows } = await pool.query("SELECT * FROM users where email = $1", [
    email,
  ]);

  // 용도 : access token을 갱신.
  try {
    const token = req.cookies.refreshToken;
    const data = jwt.verify(token, process.env.REFRECH_SECRET);
    const userData = rows[0].filter((item) => {
      return item.email === data.email;
    });

    // access Token 새로 발급
    const accessToken = jwt.sign(
      {
        id: userData.user_id,
        username: userData.username,
        email: userData.email,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "1m",
        issuer: "About Tech",
      }
    );

    res.cookie("accessToken", accessToken, {
      secure: false,
      httpOnly: true,
    });

    res.status(200).json("Access Token Recreated");
  } catch (error) {
    res.status(500).json(error);
  }
};

const loginSuccess = async (req, res) => {
  const { email, password } = req.body;
  let { rows } = await pool.query("SELECT * FROM users where email = $1", [
    email,
  ]);

  try {
    const token = req.cookies.accessToken;
    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    let userData = [];
    if (rows.length > 0) {
      userData = rows[0].filter((item) => {
        console.log(userData);
        return item.email === data.email;
      });
    }

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

const logout = (req, res) => {
  try {
    res.cookie("accessToken", "");
    res.status(200).json("Logout success");
  } catch {
    res.status(500).json(error);
  }
};

export default { login, accesstoken, refreshToken, loginSuccess, logout };
