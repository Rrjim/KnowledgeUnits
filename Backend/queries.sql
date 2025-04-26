CREATE TABLE Users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL
);

CREATE TABLE repositories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    language VARCHAR(50),
    owner_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_repositories (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    repo_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_repo FOREIGN KEY (repo_id) REFERENCES repositories(id) ON DELETE CASCADE,
    UNIQUE(user_id, repo_id)
);

CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    download_url TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, 
    owner VARCHAR(255) NOT NULL,
    repo_id INT NOT NULL,  
    repo_name VARCHAR(255),
    FOREIGN KEY (repo_id) REFERENCES repositories(id) ON DELETE CASCADE
);


CREATE TABLE user_files (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,   
    file_id INT NOT NULL,   
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
    UNIQUE(user_id, file_id)  
);


CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,           
    collection_name VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    candidate VARCHAR(255) NOT NULL,
    programming_language VARCHAR(50),
    repositories TEXT[] DEFAULT '{}',      
    repositories_number INT DEFAULT 0,     
    score INT DEFAULT 0,                      
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE collection_files (
    id SERIAL PRIMARY KEY,
    collection_id INT NOT NULL,
    file_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
    UNIQUE(collection_id, file_id)
);
