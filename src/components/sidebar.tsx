import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import appRoutes from '../routes/routes';

const Sidebar = () => {
return (
    <div className="sidebar">
        <div className="logo">
            <h1>PA-WEB</h1>
        </div>
        <hr />
        <div className="menu">
            <ul>
                <li>
                <Link to={appRoutes.DASHBOARD_HOME}>
                    <DashboardIcon className='icon'/>
                    <span>Tableau de bord</span>
                </Link>
                </li>
                <li>
                   <Link to={appRoutes.JEUX}>
                   <SportsEsportsIcon className='icon'/>
                    <span>Jeux</span></Link>
                </li>
                <li>
                    <MeetingRoomIcon className='icon'/>
                    <span>Salons</span>
                </li>
                <li>
                    <PeopleIcon className='icon'/>
                    <span>Amis</span>
                </li>
               
            </ul>
        </div>
    </div>
);
}

export default Sidebar;