import pkg from "pg";
import { pool } from "../../../app.js";
//다건
const posts = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM posts");
    console.log(rows);
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
const post = async (req, res) => {
  try {
    const id = req.params.post.id;
    const { rows } = await pool.query(
      "SELECT * FROM posts WHERE post_id = $1",
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
};
const createpost = async (req, res) => {
  try {
    const { post_id, post_title, post_content, post_date, user_id } = req.body;
    const { rows } = await pool.query(
      `
        INSERT INTO reviews (post_id, title, content, post_date, user_id) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
      [post_id, post_title, post_content, post_date, user_id]
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
};

const remotepost = async (req, res) => {
  try {
    const { id } = req.params;
    const { post_id, post_title, post_content, post_date, user_id } = req.body;
    const { rows } = await pool.query(
      `
        UPDATE reviews 
        SET post_id = $1, post_title = $2, post_content = $3, post_date = $4, user_id=$5
        WHERE id = $6
        RETURNING *
        `,
      [post_id, post_title, post_content, post_date, user_id, id]
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
};

const deletepost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM comments WHERE id = $1 RETURNING *",
      [post_id]
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
};

//사용자 리뷰
const userpost = async (req, res) => {
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
};

export default {
  posts,
  post,
  createpost,
  remotepost,
  deletepost,
  userpost,
};
