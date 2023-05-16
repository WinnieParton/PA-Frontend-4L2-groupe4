import { Outlet } from 'react-router';
import Sidebar from '../../components/sidebar';
import Navigation from '../../components/Navigation';

const Dashboard = () => {

    
    return (
        <div className=''>
          <Navigation/>
          <Outlet/>

        </div>
    );
};

export default Dashboard;
