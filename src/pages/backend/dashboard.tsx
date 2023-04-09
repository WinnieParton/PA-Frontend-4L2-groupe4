import { Outlet } from 'react-router';

const Dashboard = () => {
    return (
        <>
            <h2>Dashboard</h2>
            <Outlet />
        </>
    );
};

export default Dashboard;
