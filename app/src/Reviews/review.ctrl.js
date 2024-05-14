import pkg from "pg";
import { pool } from "../../../app.js";

const createreview = async (req, res) => {
  try {
    const { restaurant_id, contents, username, rating, hashtags } = req.body;
    const date = new Date().toISOString().slice(0, 10);

    // 리뷰 정보 저장
    const { rows: reviewRows } = await pool.query(
      `
        INSERT INTO reviews (restaurant_id, contents, date, rating, username) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
      [restaurant_id, contents, date, rating, username]
    );

    const reviewId = reviewRows[0].id;

    // 해시태그 정보 저장 및 매핑
    for (const tag of hashtags) {
      // 이미 존재하는 해시태그인지 확인
      const { rows: existingHashtags } = await pool.query(
        `
          SELECT id FROM hashtags WHERE tag = $1
        `,
        [tag]
      );

      let hashtagId;

      if (existingHashtags.length > 0) {
        // 이미 존재하는 경우
        hashtagId = existingHashtags[0].id;
      } else {
        // 존재하지 않는 경우 새로운 해시태그 추가
        const { rows: newHashtagRows } = await pool.query(
          `
            INSERT INTO hashtags (category, tag)
            VALUES ($1, $2)
            RETURNING id
          `,
          ["Custom", tag]
        );

        hashtagId = newHashtagRows[0].id;
      }

      // 리뷰와 해시태그 간의 매핑 정보 저장
      await pool.query(
        `
          INSERT INTO reviews_hashtags (reviews_id, hashtags_id)
          VALUES ($1, $2)
        `,
        [reviewId, hashtagId]
      );
    }

    res.json({
      resultCode: "S-1",
      msg: "성공",
      data: reviewId,
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
    const { restaurant_id, contents, username, rating } = req.body;
    const { rows } = await pool.query(
      `
        UPDATE reviews 
        SET restaurant_id = $1, contents = $2, review_date = CURRENT_TIMESTAMP, username = $4 , rating = $5 
        WHERE id = $6
        RETURNING *
        `,
      [restaurant_id, contents, username, rating]
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

// 식당정보+리뷰 정보 조회
const getReviews = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    // 식당 정보 조회
    const restaurantQuery = await pool.query(
      `SELECT * FROM restaurants WHERE restaurants_id = $1`,
      [restaurant_id]
    );

    const restaurant = restaurantQuery.rows[0];

    // 식당 리뷰 조회
    const reviewsQuery = await pool.query(
      `
      SELECT 
        r.id AS review_id,
        r.username,
        r.contents AS review_contents,
        r.date AS review_date,
        r.rating,
        h.contents AS hashtag
      FROM 
        reviews AS r
      INNER JOIN
        reviews_hashtags AS rh ON r.id = rh.reviews_id
      INNER JOIN
        hashtags AS h ON rh.hashtags_id = h.id
      WHERE
        r.restaurant_id = $1
      `,
      [restaurant_id]
    );

    const reviews = reviewsQuery.rows;

    res.json({
      resultCode: "S-1",
      msg: "Success",
      restaurant: restaurant,
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error fetching restaurant and reviews:", error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "Error fetching restaurant and reviews",
      error: error.message,
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
    // const { restaurant_id } = req.params;
    const reviews = await pool.query(
      `SELECT r.*, array_agg(h.contents) AS hashtags
       FROM reviews AS r
       LEFT JOIN reviews_hashtags AS rh ON r.id = rh.reviews_id
       LEFT JOIN hashtags AS h ON rh.hashtags_id = h.id
       GROUP BY r.id`,
      [] // restaurant_id 매개변수 전달
    );
    res.json({
      resultCode: "S-1",
      msg: "Success",
      data: reviews.rows,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "Error fetching reviews",
      error: error.message,
    });
  }
};

// 해시태그 목록을 가져오는 엔드포인트
const getHashtags = async (req, res) => {
  try {
    const hashtags = await pool.query("SELECT * FROM hashtags", []);
    res.json({
      resultCode: "S-1",
      msg: "Success",
      data: hashtags.rows,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      resultCode: "F-1",
      msg: "Error fetching reviews",
      error: error.message,
    });
  }
};

export default {
  createreview,
  remotereview,
  deletereview,
  getReviews,
  userreview,
  restreview,
  getHashtags,
};
