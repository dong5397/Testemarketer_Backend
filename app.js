import express from "express";
import pkg from "pg";
import cors from "cors";
import multer from "multer";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "5dNsHSzJJpVuObC",
  host: "testebend.internal",
  database: "postgres",
  port: 5432,
});

const app = express();

app.use(express.json());
const corsOptions = {
  origin: "https://cdpn.io",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// 이미지 업로드를 위한 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// get 식당 정보 조회
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM restaurants");
    res.json({
      resultCode: "S-1",
      msg: "성공",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "에러 발생",
    });
  }
});

// 사용자 정보 생성
app.post("/api/v1/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { rows } = await pool.query(
      `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [username, email, password]
    );
    res.json({
      resultCode: "S-1",
      msg: "성공",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "에러 발생",
    });
  }
});

// 리뷰 생성
app.post("/api/v1/reviews", async (req, res) => {
  try {
    const { restaurant_id, review_text, review_date, user_id } = req.body;
    const { rows } = await pool.query(
      `
      INSERT INTO reviews (restaurant_id, review_text, review_date, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [restaurant_id, review_text, review_date, user_id]
    );
    res.json({
      resultCode: "S-1",
      msg: "성공",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "에러 발생",
    });
  }
});

// 사용자 정보 조회
app.get("/api/v1/users/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );
    res.json({
      resultCode: "S-1",
      msg: "성공",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "에러 발생",
    });
  }
});

// 식당 별점 순 상위 10개 조회
app.get("/api/v1/restaurants/top", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM restaurants ORDER BY rating DESC LIMIT 10"
    );
    res.json({
      resultCode: "S-1",
      msg: "성공",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "에러 발생",
    });
  }
});

// 사용자의 리뷰 목록 조회
app.get("/api/v1/users/:user_id/reviews", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM reviews WHERE user_id = $1",
      [user_id]
    );
    res.json({
      resultCode: "S-1",
      msg: "성공",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "에러 발생",
    });
  }
});

// 특정 식당의 리뷰 목록 조회
app.get("/api/v1/restaurants/:restaurant_id/reviews", async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM reviews WHERE restaurant_id = $1",
      [restaurant_id]
    );
    res.json({
      resultCode: "S-1",
      msg: "성공",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "에러 발생",
    });
  }
});

// POST: 식당 등록 및 이미지 업로드
app.post(
  "/api/v1/restaurants",
  upload.single("image"),
  async (req, res, next) => {
    try {
      const {
        restaurants_name,
        address,
        phone,
        opening_hours,
        rating,
        taste_level,
      } = req.body;
      const image = req.file.path;
      const { rows } = await pool.query(
        "INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, taste_level, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          restaurants_name,
          address,
          phone,
          opening_hours,
          rating,
          taste_level,
          image,
        ]
      );
      res.status(201).json({
        resultCode: "S-1",
        msg: "성공",
        data: rows[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        resultCode: "F-1",
        msg: "에러 발생",
      });
    }
  }
);

// 이미지 파일 제공
app.use("/uploads", express.static("uploads"));

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
