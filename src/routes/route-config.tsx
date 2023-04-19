import Forgot from '../pages/auth/forgot';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import Dashboard from '../pages/backend/dashboard';
import RouteProtected from './route-protected';
import appRoutes from './routes';
import Home from '../pages/backend/home';
import ListJeux from '../pages/backend/jeux/listJeux';
const routesConfig = [
    {
        path: appRoutes.HOME,
        element: <Login />,
    },
    {
        path: appRoutes.LOGIN,
        element: <Login />,
    },
    {
        path: appRoutes.REGISTER,
        element: <Register />,
    },
    {
        path: appRoutes.FORGOT,
        element: <Forgot />,
    },
    {
        path: appRoutes.DASHBOARD,
        element: (
        <RouteProtected expectedRoles={['user']}>
            <Dashboard />
        </RouteProtected>),
        children: [
            {
                path: appRoutes.DASHBOARD_HOME,
                element: <Home />,
            },
            {
                path: appRoutes.JEUX,
                element: <ListJeux/>,
            },
        ],
    },
];

export default routesConfig;