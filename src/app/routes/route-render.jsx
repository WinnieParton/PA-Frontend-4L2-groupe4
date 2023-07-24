import { useRoutes } from 'react-router';
import routesConfig from './route-config';

const RouteRender = () => {
 return useRoutes(routesConfig)
};

export default RouteRender;
