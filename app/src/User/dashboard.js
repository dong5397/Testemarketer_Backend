import { Router } from "express";
import { pool } from "../../../app.js";
import authorization from "./authorization.js";
const router = Router();

router.get("/", authorization, async (req, res) => {
  try {
    //req.user has a payload
    //res.json(req.user.id);

    const user = await pool.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [req.user.id]
    );

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Sever Error");
  }
});
export default router;
