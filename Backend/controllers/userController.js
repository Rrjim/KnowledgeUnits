import db from "../config/database.js";

export const getUserStats = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const [likedReposResult, savedFilesResult, createdCollectionsResult, mvpResult] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM user_repositories WHERE user_id = $1`, [userId]),
      db.query(`SELECT COUNT(*) FROM user_files WHERE user_id = $1`, [userId]),
      db.query(`SELECT COUNT(*) FROM collections WHERE user_id = $1`, [userId]),
      db.query(`SELECT candidate, score FROM collections WHERE user_id = $1 ORDER BY score DESC LIMIT 1`, [userId]), // ✅ fix here
    ]);

    res.json({
      likedReposCount: parseInt(likedReposResult.rows[0].count, 10),
      savedFilesCount: parseInt(savedFilesResult.rows[0].count, 10),
      createdCollectionsCount: parseInt(createdCollectionsResult.rows[0].count, 10),
      maxCollectionScore: mvpResult.rows[0] ? parseFloat(mvpResult.rows[0].score) : 0,
      bestCandidate: mvpResult.rows[0] ? mvpResult.rows[0].candidate : null
    });

  } catch (err) {
    console.error("Error fetching user statistics:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
