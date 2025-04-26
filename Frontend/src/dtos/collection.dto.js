const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const createCollectionDTO = (name, candidate, lang, repos, score, currentUser, fileId) => {
  return {
    collectionName: name,
    candidate: capitalizeFirstLetter(candidate),
    language: lang,
    repositories: Array.isArray(repos)
      ? repos.map((r) => capitalizeFirstLetter(r))
      : [capitalizeFirstLetter(repos)],
    repositoriesLength: Array.isArray(repos) ? repos.length : 1,
    score: score,
    userId: currentUser.id,
    userName: capitalizeFirstLetter(currentUser?.email.split('@')[0]),
    fileId: fileId, 
  };
};

export { createCollectionDTO };
