import { pool, jwt } from "../../../app.js"; // JWT 모듈 가져오기

const uselogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 이메일로 사용자를 데이터베이스에서 찾습니다.
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // 사용자가 존재하고 비밀번호가 일치하는지 확인합니다.
    if (rows.length > 0 && rows[0].password === password) {
      const token = jwt.sign({ userId: rows[0].id }, "secretKey", {
        expiresIn: "1h", // 토큰 만료 시간 설정
      });

      return res.json({
        resultCode: "S-1",
        msg: "로그인 성공",
        data: { token }, // JWT 토큰 반환
      });
    } else {
      // 사용자가 존재하지 않거나 비밀번호가 일치하지 않는 경우 에러 응답
      res.status(401).json({
        resultCode: "F-1",
        msg: "이메일 또는 비밀번호가 올바르지 않습니다.",
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

export default { uselogin };
