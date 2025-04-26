import axios from "axios";
import db from "../config/database.js";
import { FileDTO } from "../dtos/githubSearch.dto.js";
import { capitalizeFirstLetter } from "../Transformers/UsernameTransformer.js";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const getRepoIdAndLanguage = async (owner, repoName) => {
  console.log(owner, repoName);
    try {
      const url = `https://api.github.com/repos/${owner}/${repoName}`;
      const headers = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {};
      const response = await axios.get(url, { headers });
  
      return {
        id: response.data.id,
        language: response.data.language,
      };
    } catch (error) {
      console.error("Error fetching repo details:", error.response?.data || error.message);
      return null;
    }
  };
  
  export const addFileToRepo = async (req, res) => {
    const { fileId, userId, repoName, owner, fileName, downloadUrl } = req.body;
    console.log(req.body);
    const repoQuery = `
    SELECT id, language 
    FROM repositories 
    WHERE TRIM(LOWER(name)) = TRIM(LOWER($1)) 
    AND TRIM(LOWER(owner_name)) = TRIM(LOWER($2))
    `;
  
    const getFileQuery = "SELECT * FROM files WHERE id = $1";
    const getUserFileQuery = "SELECT * FROM user_files WHERE user_id = $1 AND file_id = $2";
    const deleteUserFileQuery = "DELETE FROM user_files WHERE user_id = $1 AND file_id = $2";
    const insertUserFileQuery = "INSERT INTO user_files (user_id, file_id) VALUES ($1, $2) ON CONFLICT DO NOTHING";
    const insertFileQuery = "INSERT INTO files (id, name, download_url, type, owner, repo_id, repo_name) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  
    const junctionObjQueryParams = [userId, fileId];
  
    try {
      // Check if repo exists in the database
      const { rows: repoRows } = await db.query(repoQuery, [repoName, owner]);
      let repoId, language;
      const getSuffix = (str) => str.split('.').pop();
      const suffix = getSuffix(fileName);
  
      if (repoRows.length > 0) {
        repoId = repoRows[0].id;
        language = repoRows[0].language;
        // console.log("Fetched from DB:", repoId, language);
      } else {
        // Repo not found, fetch from GitHub API
        const repoData = await getRepoIdAndLanguage(owner, repoName);
        if (!repoData) {
          return res.status(404).json({ error: "Repository not found on GitHub" });
        }
  
        repoId = repoData.id;
        language = repoData.language;
  
        // Store repo in the database
        const insertRepoQuery = "INSERT INTO repositories (id, name, owner_name, language) VALUES ($1, $2, $3, $4)";
        // console.log("Stored repo in DB:", repoId, language);
        await db.query(insertRepoQuery, [repoId, repoName, capitalizeFirstLetter(owner), language]);
      }
  
      // Check if the file exists in files
      const { rows: existingFile } = await db.query(getFileQuery, [fileId]);
  
      if (existingFile.length === 0) {
        // Insert the file only if it doesn't already exist
        await db.query(insertFileQuery, [fileId, fileName, downloadUrl, suffix, capitalizeFirstLetter(owner), repoId, repoName]);
      } else {
        console.log("File already exists, skipping insert.");
      }
  
      // Check if user already added this file
      const { rows: existingUserFile } = await db.query(getUserFileQuery, junctionObjQueryParams);
      console.log(existingUserFile);
      console.log(existingUserFile.length);
      if (existingUserFile.length > 0) {
        await db.query(deleteUserFileQuery, junctionObjQueryParams);
        res.status(200).json({ message: "File removed successfully!" });
      } else {
        await db.query(insertUserFileQuery, junctionObjQueryParams);
        res.status(200).json({ message: "File added successfully!" });
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  
  // Fetch files added by a user to a specific repository
  export const getRepoFiles = async (req, res) => {
    const { userId, repoId } = req.query;  
    if (!userId || !repoId) {  
      return res.status(400).json({ message: "User ID and Repo Name are required" });
    }
  
    try {
      // Fetch files for the given user and repo
      const query = `
        SELECT f.id, f.name, f.download_url, f.type, f.owner, f.repo_id, f.repo_name
        FROM files f
        JOIN user_files uf ON f.id = uf.file_id
        WHERE f.repo_id = $1 AND uf.user_id = $2
      `;
  
      const { rows } = await db.query(query, [repoId, userId]);
      console.log(rows);
      // Create a FileDTO for each file
      const filesDTO = rows.map(file => new FileDTO(
        file.id, 
        file.name, 
        file.type, 
        file.download_url, 
        file.repo_id,
        file.owner,
        file.repo_name
      ));
  
      res.status(200).json({ files: filesDTO });
    } catch (error) {
      console.error("Error fetching repository files:", error);
      res.status(500).json({ message: "Error fetching repository files" });
    }
  };
  
  // Get all files added by a user (across all repositories)
  export const getAllUserFiles = async (req, res) => {
    const { userId } = req.query;
  
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    try {
      const query = `
        SELECT f.id, f.name, f.download_url, f.type, f.owner, f.repo_id, f.repo_name
        FROM files f
        JOIN user_files uf ON f.id = uf.file_id
        WHERE uf.user_id = $1
      `;
  
      const { rows } = await db.query(query, [userId]);
  
      const filesDTO = rows.map(file => new FileDTO(
        file.id, 
        file.name, 
        file.type, 
        file.download_url, 
        file.repo_id,
        file.owner,
        file.repo_name
      ));
      
      res.status(200).json({ files: filesDTO });
    } catch (error) {
      console.error("Error fetching user files:", error);
      res.status(500).json({ message: "Error fetching user files" });
    }
  };
  
  export const setLabelFiles = async (req, res) => {
    const fileId = req.params.id;
    const { labels } = req.body;
    console.log(fileId);
    console.log(req.body);
    try {
      const result = await db.query(
        `UPDATE files SET labels = $1 WHERE id = $2 RETURNING *`,
        [labels, fileId]
      );
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("Error updating labels:", err);
      res.status(500).json({ error: "Failed to update labels" });
    }
  };
  