import pkg from "pg";
import { pool } from "../../../app.js";

//다건
const restrs = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM restaurants");
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
// 단건
const restr = async (req, res) => {
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
}; // 특정 카테고리의 식당 데이터를 반환하는 엔드포인트
const restc = async (req, res) => {
  const category = req.params.category;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM restaurants WHERE category = $1::text",
      [category]
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
  restrs,
  restr,
  restc,
};
