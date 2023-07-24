import React from 'react';
import { Outlet } from 'react-router';
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
