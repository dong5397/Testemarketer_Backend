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
  const commentId = req.params.comment_id; // 경로 파라미터에서 comment_id 가져오기
  try {
    const { rows } = await pool.query(
      "SELECT * FROM comments WHERE comment_id = $1",
      [commentId]
    ); // 쿼리와 파라미터 바인딩
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
    const { post_id: postId } = req.params; // postId로 변경
    const { comment_text, comment_date } = req.body;
    console.log("Received Data:", req.body); // 입력 값 확인을 위한 로그

    const query = `
          INSERT INTO comments (post_id,comment_text, comment_date )
          VALUES ($1, $2,$3)
          RETURNING *
        `;
    const values = [postId, comment_text, comment_date];

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
  const { post_id, commentid } = req.params;

  // 클라이언트에서 올바른 값을 전달하는지 확인
  if (!post_id || !commentid) {
    return res.status(400).json({
      resultCode: "F-1",
      msg: "post_id 또는 commentId가 누락되었습니다.",
    });
  }

  try {
    const result = await pool.query(
      "DELETE FROM comments WHERE post_id = $1 AND commentid = $2 RETURNING *",
      [post_id, commentid]
    );

    if (result.rowCount > 0) {
      res.json({
        resultCode: "S-1",
        msg: "댓글 삭제 성공",
      });
    } else {
      res.status(404).json({
        resultCode: "F-2",
        msg: "해당 댓글을 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      resultCode: "F-3",
      msg: "댓글 삭제 에러 발생",
    });
  }
};

// 댓글 가져오기
const getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1",
      [postId]
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
  comments,
  comment,
  createcomment,
  deletecomment,
  getCommentsByPostId,
};
