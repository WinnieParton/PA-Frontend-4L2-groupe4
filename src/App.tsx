import { BrowserRouter } from 'react-router-dom';
import RouteRender from './app/routes/route-render';

function App() {
    return (
        <BrowserRouter>
            <RouteRender />
        </BrowserRouter>
    );
}

export default App;
