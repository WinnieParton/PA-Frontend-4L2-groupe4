import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from "react";

const Salon = () => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return   <div className="page-wrapper">
    <div className="page-wrapper-header">
        <div className="page-wrapper-header-title">
            <h2>Nom du salon</h2>
        </div>
        <div className="page-wrapper-header-action">
            
            <div className="btn-friend-action">
                <button>Modifier</button>
            </div>
        </div>
    </div>

    <div className="page-wrapper-content">
        <div className="page-wrapper-hero">
            <div className="page-wrapper-hero-left">
                <img src="https://cdn.pixabay.com/photo/2023/01/04/12/21/puzzle-pieces-7696621_960_720.jpg" alt="" />
            </div>
            <div className="page-wrapper-hero-rigth">
                <h3>Jeux : Nom du jeu</h3>
                <p>3 Participants</p>
                <Button variant="outlined" color='primary'>Ajouter un ami</Button>
            </div>
        </div>



        <div className="obj-grid">
                    <div className="obj-card">
                        <div className="obj-card-left">
                            <div>
                                <img
                                    src="https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640"
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
                                        <PersonRemoveIcon fontSize="small" color='error' />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Retirer du salon
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className="obj-card">
                        <div className="obj-card-left">
                            <div>
                                <img
                                    src="https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640"
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
                                        <PersonRemoveIcon fontSize="small" color='error' />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Retirer du salon
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className="obj-card">
                        <div className="obj-card-left">
                            <div>
                                <img
                                    src="https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640"
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
                                        <PersonRemoveIcon fontSize="small" color='error' />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Retirer du salon
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>


    </div>
    </div>
}

export default Salon;