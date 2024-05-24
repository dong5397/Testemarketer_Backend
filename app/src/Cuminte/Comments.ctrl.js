import { pool } from "../../../app.js";

// 다건 조회
const comments = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM comments");
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
const comment = async (req, res) => {
  const commentId = req.params.id; // 경로 파라미터에서 comment_id 가져오기
  try {
    const { rows } = await pool.query("SELECT * FROM comments WHERE id = $1", [
      commentId,
    ]); // 쿼리와 파라미터 바인딩
    if (rows.length === 0) {
      return res.status(404).json({
        resultCode: "F-2",
        msg: "댓글을 찾을 수 없습니다",
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
// 생성
const createcomment = async (req, res) => {
  try {
    const { comment_text, comment_date } = req.body;
    console.log("Received Data:", req.body); // 입력 값 확인을 위한 로그

    const query = `
          INSERT INTO comments (comment_text, comment_date )
          VALUES ($1, $2)
          RETURNING *
        `;
    const values = [comment_text, comment_date];

    const { rows } = await pool.query(query, values);
    console.log("Query Result:", rows); // 쿼리 결과 확인을 위한 로그

    if (rows.length === 0) {
      return res.status(400).json({
        resultCode: "F-2",
        msg: "댓글 작성 실패",
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
const deletecomment = async (req, res) => {
  const commentId = req.params.id;
  try {
    const result = await pool.query("DELETE FROM comments WHERE id = $1", [
      commentId,
    ]);

    if (result.rowCount > 0) {
      res.json({
        resultCode: "S-1",
        msg: "성공",
      });
    } else {
      res.status(404).json({
        resultCode: "F-1",
        msg: "해당 댓글을 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      resultCode: "F-2",
      msg: "에러 발생",
    });
  }
};

export default {
  comments,
  comment,
  createcomment,
  deletecomment,
};
