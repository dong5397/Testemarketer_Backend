import jwt from "jsonwebtoken";
import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
  user: "postgres",
  password: "aETIPYoC5pUXfps",
  host: "makterteste-db.internal",
  database: "postgres",
  port: 5432,
});

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(403).json("Not Authorized");
    }

    const user = rows[0];

    // access Token 발급
    const accessToken = jwt.sign(
      {
        id: user.user_id,
        username: user.username,
        email: user.email,
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
        id: user.user_id,
        username: user.username,
        email: user.email,
      },
      process.env.REFRESH_SECRET,
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
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const accesstoken = async (req, res) => {
  const token = req.cookies.accessToken;
  try {
    if (!token) {
      return res.status(403).json("Access Token not provided");
    }

    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      data.email,
    ]);

    if (rows.length === 0) {
      return res.status(403).json("User not found");
    }

    const user = rows[0];

    const { password, ...others } = user;
    res.status(200).json(others);
  } catch (error) {
    console.error("Error during access token verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  try {
    if (!token) {
      return res.status(403).json("Refresh Token not provided");
    }

    const data = jwt.verify(token, process.env.REFRESH_SECRET);
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      data.email,
    ]);

    if (rows.length === 0) {
      return res.status(403).json("User not found");
    }

    const user = rows[0];

    // access Token 새로 발급
    const accessToken = jwt.sign(
      {
        id: user.user_id,
        username: user.username,
        email: user.email,
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
    console.error("Error during refresh token verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginSuccess = async (req, res) => {
  const token = req.cookies.accessToken;
  try {
    if (!token) {
      return res.status(403).json("Access Token not provided");
    }

    // 액세스 토큰의 유효성 검사
    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    // 데이터베이스에서 사용자 조회
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      data.email,
    ]);

    // 사용자가 존재하지 않는 경우 403 에러 반환
    if (rows.length === 0) {
      return res.status(403).json("User not found");
    }

    // 조회된 사용자 정보 반환
    const user = rows[0];
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login success:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json("Logout success");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default { login, accesstoken, refreshToken, loginSuccess, logout };
