import { pool } from "../../../app.js";

// 다건 조회
const posts = async (req, res) => {
  try {
    const { title } = req.query;
    let query = "SELECT * FROM posts";
    let params = [];

    if (title) {
      query += " WHERE title ILIKE $1";
      params.push(`%${title}%`);
    }

    const { rows } = await pool.query(query, params);
    console.log("Posts Query Result:", rows); // 쿼리 결과 확인을 위한 로그
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
};
// 단건 조회
const post = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM posts WHERE post_id = $1",
      [post_id]
    );
    console.log("Single Post Query Result:", rows); // 쿼리 결과 확인을 위한 로그
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
};

// 생성
const createpost = async (req, res) => {
  try {
    const { post_title, post_content, post_date } = req.body;
    console.log("Received Data:", req.body); // 입력 값 확인을 위한 로그

    const query = `
      INSERT INTO posts (title, content, post_date)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [post_title, post_content, post_date];

    const { rows } = await pool.query(query, values);
    console.log("Query Result:", rows); // 쿼리 결과 확인을 위한 로그

    if (rows.length === 0) {
      return res.status(400).json({
        resultCode: "F-2",
        msg: "글 작성 실패",
      });
    }

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
};

const remotepost = async (req, res) => {
  try {
    const { postId, post_title, post_content, post_date } = req.body;

    // 클라이언트에서 post_date 값을 제공하지 않은 경우, 현재 시간을 기본 값으로 사용
    const actualPostDate = post_date || new Date();

    const query = `
      UPDATE posts
      SET title = $1, content = $2, post_date = $3
      WHERE post_id = $4
      RETURNING *
    `;

    const values = [post_title, post_content, actualPostDate, postId];

    const { rows } = await pool.query(query, values);
    console.log("Update Query Result:", rows);

    if (rows.length === 0) {
      return res.status(400).json({
        resultCode: "F-2",
        msg: "글 수정 실패",
      });
    }

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
};

// 삭제
const deletepost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM posts WHERE post_id = $1 RETURNING *",
      [post_id]
    );
    console.log("Delete Query Result:", rows); // 삭제 결과 확인을 위한 로그

    if (rows.length > 0) {
      res.json({
        resultCode: "S-1",
        msg: "성공",
        data: rows[0],
      });
    } else {
      res.status(404).json({
        resultCode: "F-1",
        msg: "해당 포스트를 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "에러 발생",
    });
  }
};

export default {
  posts,
  post,
  createpost,
  remotepost,
  deletepost,
};
