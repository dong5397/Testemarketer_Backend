import pkg from "pg";
import { pool } from "../../../app.js";

const createreview = async (req, res) => {
  try {
    const { restaurants_id, review_text, user_id } = req.body;
    const { rows } = await pool.query(
      `
        INSERT INTO reviews (restaurants_id, review_text, review_date, user_id) 
        VALUES ($1, $2, CURRENT_TIMESTAMP, $3)
        RETURNING *
        `,
      [restaurants_id, review_text, user_id]
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

const remotereview = async (req, res) => {
  try {
    const { id } = req.params;
    const { restaurant_id, review_text, user_id } = req.body;
    const { rows } = await pool.query(
      `
        UPDATE reviews 
        SET restaurant_id = $1, review_text = $2, review_date = CURRENT_TIMESTAMP, user_id = $4
        WHERE id = $5
        RETURNING *
        `,
      [restaurant_id, review_text, user_id, id]
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

const deletereview = async (req, res) => {
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
};

//사용자 리뷰
const userreview = async (req, res) => {
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

//식당 리뷰
const restreview = async (req, res) => {
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
};

export default {
  createreview,
  remotereview,
  deletereview,
  userreview,
  restreview,
};
