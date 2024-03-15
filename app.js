import express from "express";
import pkg from "pg";
import cors from "cors";

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
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

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
// 식당 단건 조회
app.get("/api/v1/restaurants/:restaurants_id", async (req, res) => {
  try {
    const id = req.params.restaurants_id;
    const { rows } = await pool.query(
      "SELECT * FROM restaurants WHERE restaurants_id = $1",
      [id]
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
// 토큰
app.get("sign_token", (req, res) => {
  let token = jwt.sign(
    { name: "sancho", exp: parseInt(Date.now() / 1000) + 10 },
    KEY
  ); // 만료기간 10초
  res.json({ token });
});

app.get("/api/v1/check_token", (req, res) => {
  let token = req.headers["token"];
  try {
    let payload = jwt.verify(token, KEY);
    console.log("토큰 인증 성공", payload);
    res.json({ msg: "success" });
  } catch (err) {
    console.log("인증 에러");
    res.status(405).json({ msg: "error" });
    next(err);
  }
});

// 로그인 처리 엔드포인트
app.post("/api/v1/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 제공된 이메일로 사용자를 데이터베이스에서 찾습니다.
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // 사용자가 존재하고 비밀번호가 일치하는지 확인합니다.
    if (rows.length > 0 && rows[0].password === password) {
      // 사용자 정보가 일치하면 토큰 생성
      const token = jwt.sign({ email: email }, "your_secret_key");
      res.json({
        resultCode: "S-1",
        msg: "로그인 성공",
        token: token,
        data: { userName: rows[0].username }, // 사용자 이름 반환
      });
    } else {
      // 사용자가 존재하지 않거나 비밀번호가 일치하지 않는 경우 에러 응답
      res.status(401).json({
        resultCode: "F-1",
        msg: "이메일 또는 비밀번호가 올바르지 않습니다.",
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

//리뷰 생성
app.post("/api/v1/reviews", async (req, res) => {
  try {
    const { restaurant_id, review_text, review_date, user_id } = req.body; // 정확히 수정하셨네요!
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
    const { restaurant_id, review_text, review_date, user_id } = req.body; // 여기서 restaurants_id가 아닌 restaurant_id로 수정
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

// 모든 사용자 정보 조회
app.get("/api/v1/userscheck/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
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

// 특정 사용자 정보 조회
app.get("/api/v1/userscheck/:user_id", async (req, res) => {
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
    const { restaurant_id } = req.params; // 여기서 restaurants_id가 아닌 restaurant_id로 수정
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
