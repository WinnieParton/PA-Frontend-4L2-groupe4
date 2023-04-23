import { Outlet } from 'react-router';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';

const Dashboard = () => {

    
    return (
        <div className='dashboard'>
            <Sidebar/>
            <div className="dashboard-container">
                <Navbar/>
                <Outlet />
            </div>
            
        </div>
    );
};

export default Dashboard;
