import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link, useNavigate } from 'react-router-dom';
import appRoutes from '../../../routes/routes';

const ListSalon = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
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
                    <h2>Salons</h2>
                </div>
                <div className="page-wrapper-header-action">
                    <div className="search-friends">
                        <SearchIcon className="icon" />
                        <input type="text" placeholder="Rechercher" />
                    </div>
                    <div className="btn-friend-action">
                        <button>Invitations</button>
                        <button>Créer un salon</button>
                    </div>
                </div>
            </div>

            <div className="page-wrapper-content">
                <div className="obj-grid">
                    <div className="obj-card">
                        <div className="obj-card-left">
                            <div>
                                <img
                                    src="https://cdn.pixabay.com/photo/2023/01/04/12/21/puzzle-pieces-7696621_960_720.jpg"
                                    alt=""
                                />
                            </div>
                            <div className="obj-card-left-text">
                                <Link to={appRoutes.SALONS_SHOW}>
                                    <h3>Nom du salon</h3>
                                </Link>
                                <p>3 Participants</p>
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
                                        <PersonAddIcon
                                            fontSize="small"
                                            color="primary"
                                        />
                                    </ListItemIcon>
                                    <ListItemText>Ajouter un ami</ListItemText>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <DeleteIcon
                                            fontSize="small"
                                            color="error"
                                        />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Supprimer le salon
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className="obj-card">
                        <div className="obj-card-left">
                            <div>
                                <img
                                    src="https://cdn.pixabay.com/photo/2023/01/04/12/21/puzzle-pieces-7696621_960_720.jpg"
                                    alt=""
                                />
                            </div>
                            <div className="obj-card-left-text">
                                <Link to={appRoutes.SALONS_SHOW}>
                                    <h3>Nom du salon</h3>
                                </Link>

                                <p>34 Participants</p>
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
                                        <PersonAddIcon
                                            fontSize="small"
                                            color="primary"
                                        />
                                    </ListItemIcon>
                                    <ListItemText>Ajouter un ami</ListItemText>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <DeleteIcon
                                            fontSize="small"
                                            color="error"
                                        />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Supprimer le salon
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className="obj-card">
                        <div className="obj-card-left">
                            <div>
                                <img
                                    src="https://cdn.pixabay.com/photo/2023/01/04/12/21/puzzle-pieces-7696621_960_720.jpg"
                                    alt=""
                                />
                            </div>
                            <div className="obj-card-left-text">
                                <Link to={appRoutes.SALONS_SHOW}>
                                    <h3>Nom du salon</h3>
                                </Link>
                                <p>3 Participants</p>
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
                                        <PersonAddIcon
                                            fontSize="small"
                                            color="primary"
                                        />
                                    </ListItemIcon>
                                    <ListItemText>Ajouter un ami</ListItemText>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <DeleteIcon
                                            fontSize="small"
                                            color="error"
                                        />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Supprimer le salon
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListSalon;
