import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ListItemText } from '@mui/material';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import GroupsIcon from '@mui/icons-material/Groups';

const ListJeux = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
return (
    <div className="page-wrapper">
        <div className="page-wrapper-header">
            <div className="page-wrapper-header-title">
                <h2>Jeux</h2>
            </div>
            <div className="page-wrapper-header-action">
                <div className="search-friends">
                    <SearchIcon className="icon" />
                    <input type="text" placeholder="Rechercher" />
                </div>
                <div className="btn-friend-action">
                    <button>Ajouter un jeu</button>
                </div>
            </div>
        </div>

        <div className="page-wrapper-content">
            <div className="obj-grid">
                <div className="obj-card">
                    <div className="obj-card-left">
                        <div>
                            <img
                                src="https://cdn.pixabay.com/photo/2019/04/12/08/44/pacman-4121590_960_720.png"
                                alt=""
                            />
                        </div>
                        <div className="obj-card-left-text">
                            <h3>Pseudo</h3>
                            <p>4 Salons en commun</p>
                        </div>
                    </div>
                    <div className="obj-card-right">
                        <button onClick={handleClick}>
                            <MoreHorizIcon />
                        </button>

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <GroupsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Ajouter à un groupe</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <NoAccountsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Retirer des amis</ListItemText>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
                <div className="obj-card">
                    <div className="obj-card-left">
                        <div>
                            <img
                                src="https://cdn.pixabay.com/photo/2019/04/12/08/44/pacman-4121590_960_720.png"
                                alt=""
                            />
                        </div>
                        <div className="obj-card-left-text">
                            <h3>Pseudo</h3>
                            <p>4 Salons en commun</p>
                        </div>
                    </div>
                    <div className="obj-card-right">
                        <button onClick={handleClick}>
                            <MoreHorizIcon />
                        </button>

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <GroupsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Ajouter à un groupe</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <NoAccountsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Retirer des amis</ListItemText>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
                <div className="obj-card">
                    <div className="obj-card-left">
                        <div>
                            <img
                                src="https://cdn.pixabay.com/photo/2019/04/12/08/44/pacman-4121590_960_720.png"
                                alt=""
                            />
                        </div>
                        <div className="obj-card-left-text">
                            <h3>Pseudo</h3>
                            <p>4 Salons en commun</p>
                        </div>
                    </div>
                    <div className="obj-card-right">
                        <button onClick={handleClick}>
                            <MoreHorizIcon />
                        </button>

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <GroupsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Ajouter à un groupe</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <NoAccountsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Retirer des amis</ListItemText>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}

export default ListJeux;