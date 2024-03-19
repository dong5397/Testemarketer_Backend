import express from "express";
import cors from "cors";
import loginCtrl from "./app/src/Login/login.ctrl.js";
import restCtrl from "./app/src/restaurants/restaurants.ctrl.js";
import reviewCtrl from "./app/src/Reviews/review.ctrl.js";
import userCtrl from "./app/src/User/user.ctrl.js";
import pkg from "pg";
import jwt from "jsonwebtoken";

const { Pool } = pkg;

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

// JWT 시크릿 키 설정
const jwtSecretKey = "your_secret_key_here";

// 로그인 처리 엔드포인트
app.post("/api/v1/login", (req, res) => {
  const { email, password } = req.body;

  // 사용자 인증 로직 수행
  // 로그인 성공 시 토큰 생성
  const token = jwt.sign({ email }, jwtSecretKey, { expiresIn: "1h" });

  // 클라이언트에게 토큰 전송
  res.json({ token });
});

// JWT 검증 미들웨어
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 예시: JWT를 사용하여 보호된 엔드포인트
app.get("/api/v1/protected_resource", authenticateToken, (req, res) => {
  // 인증된 사용자만 접근 가능한 리소스
  res.json({ message: "인증 성공" });
});

// 예시: get 식당 정보 조회
app.get("/api/v1/restaurants", restCtrl.restrs);

// 예시: 식당 단건 조회
app.get("/api/v1/restaurants/:restaurants_id", restCtrl.restr);

// 예시: 사용자 정보 생성
app.post("/api/v1/users", userCtrl.makeuser);

// 예시: 리뷰 생성
app.post("/api/v1/reviews", reviewCtrl.createreview);

// 예시: 리뷰 수정
app.put("/api/v1/reviews/:review_id", reviewCtrl.remotereview);

// 예시: 리뷰 삭제
app.delete("/api/v1/reviews/:review_id", reviewCtrl.deletereview);

// 예시: 사용자 정보 조회
app.get("/api/v1/users/:user_id", userCtrl.selectuser);

// 예시: 사용자의 리뷰 목록 조회
app.get("/api/v1/users/:user_id/reviews", reviewCtrl.userreview);

// 예시: 특정 식당의 리뷰 목록 조회
app.get("/api/v1/restaurants/:restaurant_id/reviews", reviewCtrl.restreview);

// Hello World! 엔드포인트
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { pool, jwt };
