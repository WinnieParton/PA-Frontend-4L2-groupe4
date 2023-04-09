import Forgot from '../pages/auth/forgot';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import Dashboard from '../pages/backend/dashboard';
import RouteProtected from './route-protected';
import appRoutes from './routes';
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
        children: [],
    },
];

export default routesConfig;