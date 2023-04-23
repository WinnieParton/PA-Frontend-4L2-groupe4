import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
    Avatar,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    TextField,
} from '@mui/material';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import GroupsIcon from '@mui/icons-material/Groups';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ListAmis = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [openDialogFindFriend, setOpenDialogFindFriend] =
        React.useState(false);

    const handleClickOpenDialogFindFriend = () => {
        setOpenDialogFindFriend(true);
    };

    const handleCloseDialogFindFriend = () => {
        setOpenDialogFindFriend(false);
    };
    return (
        <div className="page-wrapper">
            <div className="page-wrapper-header">
                <div className="page-wrapper-header-title">
                    <h2>Amis</h2>
                </div>
                <div className="page-wrapper-header-action">
                    <div className="search-friends">
                        <SearchIcon className="icon" />
                        <input type="text" placeholder="Rechercher" />
                    </div>
                    <div className="btn-friend-action">
                        <button>Invitations</button>
                        <button onClick={handleClickOpenDialogFindFriend}>
                            Retrouver des amis
                        </button>
                    </div>
                </div>
            </div>

            <div className="page-wrapper-content">
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
                                        <GroupsIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Ajouter à un salon
                                    </ListItemText>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <NoAccountsIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Retirer des amis
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
                                        <GroupsIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Ajouter à un salon
                                    </ListItemText>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <NoAccountsIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Retirer des amis
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
                                        <GroupsIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Ajouter à un salon
                                    </ListItemText>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <NoAccountsIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Retirer des amis
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal retrouver un ami */}

            <Dialog
                open={openDialogFindFriend}
                onClose={handleCloseDialogFindFriend}
                maxWidth="sm"
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Retrouver des amis
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className="cs-dialog-centent">
                            <TextField
                                id="outlined-basic"
                                label="Rechercher"
                                variant="outlined"
                                sx={{ mt: 2, mb: 2, minWidth: 150 }}
                            />
                            <Divider />
                            <List>
                                <ListItemButton dense>
                                    <ListItem
                                        className="list-item-hover"
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                            >
                                                <ControlPointIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar src="https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640" />
                                        </ListItemAvatar>
                                        <ListItemText primary="Pseudo" />
                                    </ListItem>
                                </ListItemButton>
                                <ListItemButton dense>
                                    <ListItem
                                        className="list-item-hover"
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                            >
                                                <TaskAltIcon color='success'/>
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar src="https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640" />
                                        </ListItemAvatar>
                                        <ListItemText primary="Pseudo" />
                                    </ListItem>
                                </ListItemButton>
                                <ListItemButton dense>
                                    <ListItem
                                        className="list-item-hover"
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                            >
                                                <HighlightOffIcon color='error' />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar src="https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640" />
                                        </ListItemAvatar>
                                        <ListItemText primary="Pseudo" />
                                    </ListItem>
                                </ListItemButton>
                            </List>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogFindFriend} autoFocus>
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ListAmis;
