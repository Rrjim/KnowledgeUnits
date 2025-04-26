import axios from "axios";
import db from "../config/database.js";
import { UserDTO, RepositoryDTO, FileDTO } from "../dtos/githubSearch.dto.js";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;


export const usersRepo = async (req, res) => {
  try {
    const { username, repoName } = req.params;
    // Fetch all the files from the repository
    const files = await fetchRepositoryContents(username, repoName);
    // Return the list of files as a JSON response
    res.json(files);
    // console.log(files);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {

    try {

      const { username } = req.params;
      const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
        headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {},
      });

      // Map raw data into DTO format
      const repositories = response.data.map(repo => new RepositoryDTO(
        repo.id,
        repo.owner.login,
        repo.name,
        repo.description,
        repo.language,
        repo.stargazers_count,
        repo.html_url
      ));

      const userDTO = new UserDTO(username, repositories);

      res.json(userDTO);
    } catch (error) {
      res.status(error.response?.status || 500).json({ message: error.message });
      console.log(error);
    }
};

export const likeRepo = async (req, res) => {
  const { userId, repoId, repoName, repoLanguage, ownerName } = req.body; 

  const getQuery = "SELECT * FROM user_repositories WHERE user_id = $1 AND repo_id = $2";
  const deleteQuery = "DELETE FROM user_repositories WHERE user_id = $1 AND repo_id = $2";
  const postQuery = `
    INSERT INTO repositories (id, name, language, owner_name) 
    VALUES ($1, $2, $3, $4) 
    ON CONFLICT (id) DO NOTHING
  `;
  const postJunctionQuery = "INSERT INTO user_repositories (user_id, repo_id) VALUES ($1, $2) ON CONFLICT DO NOTHING";

  const junctionObjQueryParams = [userId, repoId];
  const masterQueryParams = [repoId, repoName, repoLanguage, ownerName];

  try {
    const { rows: existingRepo } = await db.query(getQuery, junctionObjQueryParams);

    if (existingRepo.length > 0) {
      await db.query(deleteQuery, junctionObjQueryParams);
      res.status(200).json({ message: "Repository unliked successfully!" });
    } else {
      await db.query(postQuery, masterQueryParams);
      await db.query(postJunctionQuery, junctionObjQueryParams);
      res.status(200).json({ message: "Repository liked successfully!" });
    }
  } catch (error) {
    console.error("Error processing repository like/unlike:", error);
    res.status(500).json({ message: "Error processing repository like/unlike" });
  }
};


export const getLikedRepos = async (req, res) => {
  const { userId } = req.query; 
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Fetch liked repositories details by joining `repositories` and `user_repositories`
    const result = await db.query(
      `SELECT r.id, r.name, r.language, r.owner_name
       FROM repositories r
       JOIN user_repositories ur ON r.id = ur.repo_id
       WHERE ur.user_id = $1`, 
      [userId]
    );

    // Send the liked repositories details
    res.status(200).json({ likedRepos: result.rows });
  } catch (error) {
    console.error("Error fetching liked repositories:", error);
    res.status(500).json({ message: "Error fetching liked repositories" });
  }
};


const fetchRepositoryContents = async (username, repoName, path = '') => {
    try {
      const url = `https://api.github.com/repos/${username}/${repoName}/contents${path ? `/${path}` : ''}`;
      const response = await axios.get(url, {
        headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {},
      });

      const data = response.data;
      let allFiles = [];

      for (const item of data) {
        if (item.type === 'file' && /\.(js|jsx|ejs)$/.test(item.name)) {
          // If it's a file and matches the extensions, add it to the list
          allFiles.push(new FileDTO(null, item.name, item.type, item.download_url, null, username));
          // console.log(allFiles);
        } else if (item.type === 'dir') {
          // If it's a directory, recursively fetch its contents
          const subFiles = await fetchRepositoryContents(username, repoName, item.path);
          allFiles = allFiles.concat(subFiles);
        }
      }

      return allFiles;
    } catch (error) {
      throw new Error(`This repo doesn't contain any file of your business!`);
    }
};