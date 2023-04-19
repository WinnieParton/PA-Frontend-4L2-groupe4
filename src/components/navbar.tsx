import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
const Navbar = () => {
    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Recherche..." />
                    <SearchIcon />
                </div>

                <div className="items">
                    <div className="item">
                        <NotificationsNoneIcon className='icon'/>
                        <div className="counter">1</div>
                    </div>
                    <div className="item">
                        <ChatBubbleOutlineIcon className='icon'/>
                        <div className="counter">2</div>
                    </div>
                    <div className="item">
                        <img src="https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640" alt="" className='avatar' />
                    </div>
                    <div className="item">
                        <LogoutIcon className='icon'/>
                        <span>Se déconnecté</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
