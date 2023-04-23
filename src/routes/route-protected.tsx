import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';

type PropsRouteProtected = PropsWithChildren<{
    expectedRoles: Array<String>;
}>;
const RouteProtected = ({ expectedRoles, children }: PropsRouteProtected) => {
    const auth = true;

    if (!auth) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default RouteProtected;
