import express from "express";
import cors from "cors";
import pkg from "pg";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// 컨트롤러 임포트
import restCtrl from "./app/src/restaurants/restaurants.ctrl.js";
import reviewCtrl from "./app/src/Reviews/review.ctrl.js";
import userCtrl from "./app/src/User/user.ctrl.js";
import cookieParser from "cookie-parser";
import loginCtrl from "./app/src/Login/login.ctrl.js";
import validinfo from "./app/src/User/validinfo.js";
import authorization from "./app/src/User/authorization.js";
import dashboard from "./app/src/User/dashboard.js";
import CumintyCtrl from "./app/src/Cuminte/Cuminty.ctrl.js";
const { Pool } = pkg;
/* 
Postgres cluster maketerbackendtest created
  Username:    postgres
  Password:    Q9rjRsnDJusBhDi
  Hostname:    maketerbackendtest.internal
  Flycast:     fdaa:5:35ca:0:1::3e
  Proxy port:  5432
  Postgres port:  5433
  Connection string: postgres://postgres:Q9rjRsnDJusBhDi@maketerbackendtest.flycast:5432*/
const pool = new Pool({
  user: "postgres",
  password: "Q9rjRsnDJusBhDi",
  host: "127.0.0.1",
  database: "postgres",
  port: 5432,
});

const app = express();
dotenv.config();

app.use("/dashboard", dashboard);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, token"
  );
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

// 로그인 처리 엔드포인트
app.post("/api/v1/login", validinfo, loginCtrl.login);
app.post("/api/v1/logout", loginCtrl.logout);

// 식당 정보 다건 조회
app.get("/api/v1/restaurants", restCtrl.restrs);

// 식당 단건 조회
app.get("/api/v1/restaurants/:restaurants_id", restCtrl.restr);

// 사용자 정보 다건 조회
app.get("/api/v1/users", userCtrl.selectusers);

// 사용자 정보 단건 조회
app.get("/api/v1/users/:user_id", userCtrl.selectuser);

// 사용자 정보 생성
app.post("/api/v1/register", validinfo, userCtrl.makeuser);

// 리뷰 생성
app.post("/api/v1/reviews", reviewCtrl.createreview);

// 리뷰 수정
app.put("/api/v1/reviews/:review_id", reviewCtrl.remotereview);

// 리뷰 삭제
app.delete("/api/v1/reviews/:review_id", reviewCtrl.deletereview);

// 사용자의 리뷰 목록 조회
app.get("/api/v1/users/:user_id/reviews", reviewCtrl.userreview);

// 특정 식당의 리뷰 목록 조회
app.get("/api/v1/restaurants/:restaurant_id/reviews", reviewCtrl.restreview);

// 커뮤니티 포스트 다건 조회
app.get("/api/v1/posts", CumintyCtrl.posts);

// 커뮤니티 포스트 단건 조회
app.get("/api/v1/post/:post_id", CumintyCtrl.post);

// 커뮤니티 포스트 생성
app.post("/api/v1/post", CumintyCtrl.createpost);

// 커뮤니티 포스트 수정
app.put("/api/v1/post/:post_id", CumintyCtrl.remotepost);

// 커뮤니티 포스트 삭제
app.delete("/api/v1/post/:post_id", CumintyCtrl.deletepost);

// 유효성 검증
app.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { pool, jwt };
