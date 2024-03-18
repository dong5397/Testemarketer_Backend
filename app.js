import express from "express";
import cors from "cors";
import loginCtrl from "./app/src/Login/login.ctrl.js";
import restCtrl from "./app/src/restaurants/restaurants.ctrl.js";
import reviewCtrl from "./app/src/Reviews/review.ctrl.js";
import userCtrl from "./app/src/User/user.ctrl.js";
import pkg from "pg";

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// get 식당 정보 조회
app.get("/api/v1/restaurants", restCtrl.restrs);
// 식당 단건 조회
app.get("/api/v1/restaurants/:restaurants_id", restCtrl.restr);
// 사용자 정보 생성
app.post("/api/v1/users", userCtrl.makeuser);
// 로그인 처리 엔드포인트
app.post("/api/v1/login", loginCtrl.uselogin);
// 리뷰 생성
app.post("/api/v1/reviews", reviewCtrl.createreview);
// 리뷰 수정
app.put("/api/v1/reviews/:review_id", reviewCtrl.remotereview);
// 리뷰 삭제
app.delete("/api/v1/reviews/:review_id", reviewCtrl.deletereview);
// 사용자 정보 조회
app.get("/api/v1/users/:user_id", userCtrl.selectuser);
// 사용자의 리뷰 목록 조회
app.get("/api/v1/users/:user_id/reviews", reviewCtrl.userreview);
// 특정 식당의 리뷰 목록 조회
app.get("/api/v1/restaurants/:restaurant_id/reviews", reviewCtrl.restreview);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { pool };
