export class UserDTO {
  constructor(username, repositories) {
    this.username = username;
    this.repositories = repositories;
  }
}

export class RepositoryDTO {
  constructor(id, ownerName, name, description, language, stargazers_count, url) {
    this.id = id;
    this.ownerName = ownerName; // ✅ Initialize owner as an object
    this.name = name;
    this.description = description;
    this.language = language;
    this.stargazers_count = stargazers_count;
    this.url = url;
  }
}


export class FileDTO {
  constructor(id, name, type, download_url, repoId, repoOwner, repoName) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.download_url = download_url;
    this.repoId = repoId;
    this.repoOwner = repoOwner;
    this.repoName = repoName;
  }
}
