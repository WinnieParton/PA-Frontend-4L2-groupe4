import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import appRoutes from '../routes/routes';
const Navigation = () => {
    const navigate = useNavigate();
    const handlLogout = () => {
        localStorage.clear();
        return navigate(appRoutes.HOME);
    };
    const getAuthRole = () => {
        const tokenString = localStorage.getItem('auth');
        const auth = JSON.parse(tokenString);
        return auth?.token.role;
    };
    return (
        <Navbar bg="light" fixed="top" expand="lg">
            <Container>
                <Navbar.Brand href="#home">PA-WEB</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto bg-light">
                        <Nav.Link
                            href={appRoutes.DASHBOARD_HOME}
                            className="mx-2"
                        >
                            Accueil
                        </Nav.Link>
                        {getAuthRole() == 'DEVELOPPER' && (
                            <Nav.Link href={appRoutes.JEUX} className="mx-2">
                                Jeux
                            </Nav.Link>
                        )}
                        <Nav.Link href={appRoutes.SALONS} className="mx-2">
                            Salons
                        </Nav.Link>
                        <Nav.Link href={appRoutes.AMIS} className="mx-2">
                            Amis
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto bg-primary">
                        <NavDropdown title="Mon compte" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">
                                Profil
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handlLogout}>
                                Se déconnecter
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
