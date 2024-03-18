import { pool } from "../../../app.js";
const makeuser = async (req, res) => {
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
};

const selectuser = async (req, res) => {
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
};

export default {
  makeuser,
  selectuser,
};
