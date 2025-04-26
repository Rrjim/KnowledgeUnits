import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

const users = [
  {
    option: "Find Users",
    link: "", 
    icon: <SearchIcon style={{color: "white"}}/>
  },
  {
    option: "Favorite Repos",
    link: "",
    icon: <FavoriteIcon style={{color: "white"}}/>
  },
  {
    option: "Standalone Files",
    link: "",
    icon: <InsertDriveFileIcon style={{color: "white"}}/>
  },
  {
    option: "Collections",
    link: "",
    icon: <CollectionsBookmarkIcon style={{color: "white"}}/>
  }
];

export default users;
