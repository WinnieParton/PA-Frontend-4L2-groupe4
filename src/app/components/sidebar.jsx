import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import React from 'react';
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
              <DashboardIcon className="icon" />
              <span>Tableau de bord</span>
            </Link>
          </li>
          {/* <li>
                   <Link to={appRoutes.JEUX}>
                   <SportsEsportsIcon className='icon'/>
                    <span>Jeux</span></Link>
                </li> */}
          <li>
            <Link to={appRoutes.SALONS}>
              <MeetingRoomIcon className="icon" />
              <span>Salons</span>
            </Link>
          </li>
          <li>
            <Link to={appRoutes.AMIS}>
              <PeopleIcon className="icon" />
              <span>Amis</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
