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
import userdata from "./app/src/Login/login.ctrl.js";

const { Pool } = pkg;

//Postgres cluster marktertest created
//Username:    postgres
//Password:    WVcmob2Ci5EDmb6
//Hostname:    marktertest.internal
//Flycast:     fdaa:5:35c8:0:1::14
//Proxy port:  5432
//Postgres port:  5433
//Connection string: postgres://postgres:WVcmob2Ci5EDmb6@marktertest.flycast:5432
const pool = new Pool({
  user: "postgres",
  password: "WVcmob2Ci5EDmb6",
  host: "127.0.0.1",
  database: "postgres",
  port: 5432,
});

const app = express();
dotenv.config();

// 기본 설정
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// 로그인 처리 엔드포인트
app.post("/api/v1/login", userdata.login);

app.get("/api/v1/accesstoken", userdata.accesstoken);
app.get("/api/v1/refreshtoken", userdata.refreshToken);
app.get("/api/v1/login/success", userdata.loginSuccess);
app.post("/api/v1/logout", userdata.logout);

// 예시: get 식당 정보 조회
app.get("/api/v1/restaurants", restCtrl.restrs);

// 예시: 식당 단건 조회
app.get("/api/v1/restaurants/:restaurants_id", restCtrl.restr);

// 예시: 사용자 정보 다건 조회
app.get("/api/v1/users", userCtrl.selectusers);

// 예시: 사용자 정보 단건 조회
app.get("/api/v1/users/:user_id", userCtrl.selectuser);

// 예시: 사용자 정보 생성
app.post("/api/v1/users", userCtrl.makeuser);

// 예시: 리뷰 생성
app.post("/api/v1/reviews", reviewCtrl.createreview);

// 예시: 리뷰 수정
app.put("/api/v1/reviews/:review_id", reviewCtrl.remotereview);

// 예시: 리뷰 삭제
app.delete("/api/v1/reviews/:review_id", reviewCtrl.deletereview);

// 예시: 사용자의 리뷰 목록 조회
app.get("/api/v1/users/:user_id/reviews", reviewCtrl.userreview);

// 예시: 특정 식당의 리뷰 목록 조회
app.get("/api/v1/restaurants/:restaurant_id/reviews", reviewCtrl.restreview);

// Hello World! 엔드포인트
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

export { pool, jwt };
