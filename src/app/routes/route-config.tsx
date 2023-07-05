import Forgot from '../pages/auth/forgot';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import Dashboard from '../pages/backend/dashboard';
import RouteProtected from './route-protected';
import appRoutes from './routes';
import Home from '../pages/backend/home';
import ListesSalon from "../pages/backend/salons/listesSalon";
import DetailSalon from '../pages/backend/salons/detailSalon';
import SalleJeu from '../pages/backend/salons/salleJeu';
import ListesAmis from '../pages/backend/amis/listesAmis';
import AjouterJeux from '../pages/backend/jeux/ajouterJeux';
import ListesJeux from '../pages/backend/jeux/listesJeux';
import VisualiserCode from '../pages/backend/jeux/visualiserCode';
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
                path: appRoutes.SALONS,
                element: <ListesSalon/>,
            },
            {
                path: appRoutes.SALONS_SHOW,
                element: <DetailSalon/>,
            },
            {
                path: appRoutes.SALLE_JEU,
                element: <SalleJeu/>,
            },

            {
                path: appRoutes.AMIS,
                element: <ListesAmis/>,
            },
            {
                path: appRoutes.JEUX,
                element: <ListesJeux/>,
            },

            {
                path: appRoutes.JEUX_AJOUTER,
                element: <AjouterJeux/>,
            },
            {
                path: appRoutes.JEUX_VISUALISER,
                element: <VisualiserCode/>,
            },

        ],
    },
];

export default routesConfig;
