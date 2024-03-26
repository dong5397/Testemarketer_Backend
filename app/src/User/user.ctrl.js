import { pool } from "../../../app.js";
import bcrypt from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator.js";

const makeuser = async (req, res) => {
  try {
    // 1. 본문 요청
    const { name, email, password } = req.body;

    // 2. 사용자가 존재하는지 확인
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).send("이미 존재하는 유저입니다!");
    }

    //3. 비밀번호를 암호화시켜 데이터베이스에 등록해야함. bcrypt
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. DB에 직접적으로 삽입하기.
    const { rows } = await pool.query(
      `
        INSERT INTO users (user_name, user_email, user_password)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [name, email, bcryptPassword]
    );
    // 5. JWT 토큰 생성
    const token = jwtGenerator(rows[0].user_id);

    res.json({
      resultCode: "S-1",
      msg: "성공",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "에러 발생",
    });
  }
};

const selectusers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
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
  selectusers,
  selectuser,
};
