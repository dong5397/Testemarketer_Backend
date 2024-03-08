import express from "express";
import pkg from "pg";
import cors from "cors";
import multer from "multer";

const { Pool } = pkg;
// Postgres cluster testebackenddb created
//   Username:    postgres
//   Password:    qAEltfF1IbsOPMx
//   Hostname:    testebackenddb.internal
//   Flycast:     fdaa:5:35ca:0:1::25
//   Proxy port:  5432
//   Postgres port:  5433
//   Connection string: postgres://postgres:qAEltfF1IbsOPMx@testebackenddb.flycast:5432
const pool = new Pool({
  user: "postgres",
  password: "qAEltfF1IbsOPMx",
  host: "testebackenddb.internal",
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

// 리뷰 수정
app.put("/api/v1/reviews/:review_id", async (req, res) => {
  try {
    const { review_id } = req.params;
    const { restaurant_id, review_text, review_date, user_id } = req.body;
    const { rows } = await pool.query(
      `
      UPDATE reviews 
      SET restaurant_id = $1, review_text = $2, review_date = $3, user_id = $4
      WHERE id = $5
      RETURNING *
      `,
      [restaurant_id, review_text, review_date, user_id, review_id]
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

//리뷰삭제
app.delete("/api/v1/reviews/:review_id", async (req, res) => {
  try {
    const { review_id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM reviews WHERE id = $1 RETURNING *",
      [review_id]
    );

    if (rows.length > 0) {
      res.json({
        resultCode: "S-1",
        msg: "성공",
        data: rows[0],
      });
    } else {
      res.status(404).json({
        resultCode: "F-1",
        msg: "해당 리뷰를 찾을 수 없습니다.",
      });
    }
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

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
