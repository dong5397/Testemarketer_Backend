import express from "express";
import cors from "cors";
import pkg from "pg";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

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
import CommentCtrl from "./app/src/Cuminte/Comments.ctrl.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
/*Postgres cluster maketerbackendnodebook created
  Username:    postgres
  Password:    cnzlwC9LnPbySwu
  Hostname:    maketerbackendnodebook.internal
  Flycast:     fdaa:5:35ca:0:1::5c
  Proxy port:  5432
  Postgres port:  5433
  Connection string: postgres://postgres:cnzlwC9LnPbySwu@maketerbackendnodebook.flycast:5432 */
const { Pool } = pkg;

// 현재 모듈의 URL 가져오기
const __filename = fileURLToPath(import.meta.url);
// 디렉토리 경로 가져오기
const __dirname = dirname(__filename);

// PostgreSQL Pool 설정
const pool = new Pool({
  user: "postgres",
  password: "cnzlwC9LnPbySwu",
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
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, "public")));

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

// 예시 : 특정 카테고리의 식당 정보 조회
app.get("/api/v1/restaurants/category/:category", restCtrl.restc);

// 예시: 리뷰 생성
app.post("/api/v1/reviews", reviewCtrl.createreview);

// 예시: 리뷰 수정
app.put("/api/v1/reviews/:review_id", reviewCtrl.remotereview);

// 예시: 리뷰 삭제
app.delete("/api/v1/reviews/:review_id", reviewCtrl.deletereview);

// 식당별 리뷰 조회
app.get("/api/v1/reviews/:restaurant_id", reviewCtrl.getReviews);

// 예시: 특정 식당의 리뷰 목록 조회
app.get("/api/v1/restaurants/reviews", reviewCtrl.restreview);

app.get("/api/tags", reviewCtrl.getHashtags);

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

// 댓글 다건 조회
app.get("/api/v1/comments", CommentCtrl.comments);

// 댓글 단건 조회
app.get("/api/v1/comments/:commentId", CommentCtrl.comment);

// 댓글 생성
app.post("/api/v1/post/:post_id/comments", CommentCtrl.createcomment);

// 댓글 삭제
app.delete(
  "/api/v1/post/:post_id/comments/:commentid",
  CommentCtrl.deletecomment
);

// 특정 포스트에 대한 댓글 조회
app.get("/api/v1/post/:postId/comments", CommentCtrl.getCommentsByPostId);
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
