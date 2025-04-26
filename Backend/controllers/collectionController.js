import db from "../config/database.js"; // This is your pg pool


export const getCollections = async (req, res) => {
  try {
    const userId = req?.session.user.id;
    const username = req.query.username;

    const query = `
    SELECT id, collection_name, repositories 
    FROM collections 
    WHERE user_id = $1 AND LOWER(candidate) = LOWER($2);
  `;  

    const { rows } = await db.query(query, [userId, username]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getCollectionRepositories = async (req, res) => {
  try {
    const userId = req?.session.user.id;
    const collectionName = req.body.name;

    const query = `
      SELECT repositories 
      FROM collections 
      WHERE user_id = $1 AND collection_name = $2
    `;

    const { rows } = await db.query(query, [userId, collectionName]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getCollectionFiles = async (req, res) => {
  try {
    const { collectionId } = req.query; 

    const query = `
      SELECT f.*, cf.added_at
      FROM collection_files cf
      JOIN files f ON cf.file_id = f.id
      WHERE cf.collection_id = $1;
    `;

    const { rows } = await db.query(query, [collectionId]);
    console.log(rows);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching collection files:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserCandidates = async (req, res) => {
  try {
    const userId = req?.session.user.id;

    const query = `
      SELECT DISTINCT candidate 
      FROM collections 
      WHERE user_id = $1;
    `;

    const { rows } = await db.query(query, [userId]);
    const candidates = rows.map(row => row.candidate);

    return res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCollection = async (req, res) => {
  const { collectionName, fileId, candidate, language, repositories, score, userId, userName } = req.body;
  console.log(req.body);

  try {

    // Insert into collections table
    const result = await db.query(
      `INSERT INTO collections (
        collection_name, candidate, programming_language, repositories, repositories_number, score, user_id, user_name
      ) VALUES ($1, $2, $3, $4::text[], $5, $6, $7, $8) RETURNING id`,
      [collectionName, candidate, language, repositories, repositories.length, score, userId, userName]
    );
    
    const collectionId = result.rows[0].id;

    // Insert into collection_files table (with file_id as VARCHAR(64))
    for (const repo of repositories) {
      await db.query(
        `INSERT INTO collection_files (collection_id, file_id) VALUES ($1, $2)`,
        [collectionId, fileId] // assuming repo is the file_id (string)
      );
    }

    return res.status(201).json({ message: 'Collection created successfully!', collectionId });
  } catch (error) {
    await db.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error creating collection:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  } 
};

export const updateCollection = async (req, res) => {
  const { fileId, collectionId, newRepositories } = req.body;

  try {
    const currentReposResult = await db.query(
      `SELECT repositories FROM collections WHERE id = $1`,
      [collectionId]
    );

    const currentRepos = currentReposResult.rows[0]?.repositories || [];
    const normalizedCurrentRepos = currentRepos.map((r) => r.toLowerCase());

    // Normalize and dedupe
    const uniqueNewRepos = newRepositories.filter(
      (repo) => !normalizedCurrentRepos.includes(repo.toLowerCase())
    );

    // If there are new unique repos, update them
    if (uniqueNewRepos.length > 0) {
      const updatedRepositories = [
        ...new Set([...normalizedCurrentRepos, ...uniqueNewRepos.map((r) => r.toLowerCase())])
      ];

      await db.query(
        `UPDATE collections SET repositories = $1, repositories_number = $2 WHERE id = $3`,
        [updatedRepositories, updatedRepositories.length, collectionId]
      );
    }

    // Always create new record in collection_files (unless it already exists)
    await db.query(
      `INSERT INTO collection_files (collection_id, file_id) 
       VALUES ($1, $2) 
       ON CONFLICT (collection_id, file_id) DO NOTHING`,
      [collectionId, fileId]
    );

    return res.status(200).json({ message: "Collection updated successfully!" });
  } catch (error) {
    console.error("Error updating collection:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteFileFromCollection = async (req, res) => {
  try {
    const { collectionId, fileId } = req.body;

    const query = `
      DELETE FROM collection_files
      WHERE collection_id = $1 AND file_id = $2;
    `;

    await db.query(query, [collectionId, fileId]);

    return res.status(200).json({ message: "File removed from collection" });
  } catch (error) {
    console.error("Error deleting file from collection:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateCollectionScore = async (req, res) => {
  const { collectionId } = req.params;
  const { score } = req.body;

  console.log(score);
  try {
    const result = await db.query(
      "UPDATE collections SET score = $1 WHERE id = $2 RETURNING *",
      [score, collectionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json({ message: "Score updated", updated: result.rows[0] });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getCollectionScore = async (req, res) => {
  try {
    const userId = req?.session.user.id;
    const collectionName = req.body.name;

    const query = `
      SELECT score 
      FROM collections 
      WHERE user_id = $1 AND collection_name = $2
    `;

    const { rows } = await db.query(query, [userId, collectionName]);

    if (rows.length === 0) {
      return res.status(200).json({ score: 0 });
    }

    return res.status(200).json({ score: rows[0].score });
  } catch (error) {
    console.error("Error fetching collection score:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
