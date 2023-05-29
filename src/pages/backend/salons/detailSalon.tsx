import React, { useEffect, useState } from 'react';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import appRoutes from '../../../routes/routes';
import { useParams } from 'react-router-dom';
import client from '../../../api/api';
import callOfDuty from '../../../assets/images/jeux/callOfDuty.jpg';

const DetailSalon = () => {
    const { id } = useParams();
    const [lobby, setLobby] = useState({});

    useEffect(() => {
        handleLoadLobby();
    }, []);

    const handleLoadLobby = async () => {
        const results = await client.get(`/lobby/${id}`);
        setLobby(results.data);
    };

    return (
        <div className="container mt-5 pt-2">
            {/*Start page head*/}
            <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
                <div>
                    <h2>{lobby.name}</h2>
                </div>
                <div>
                    <Button variant="primary" href={appRoutes.SALONS}>
                        Retour
                    </Button>
                </div>
            </div>
            {/*End page head*/}

            <div className="p-2 my-2 bg-light">
                <Row>
                    <Col md={3}>
                        <img
                            src={callOfDuty}
                            className="img-thumbnail rounded"
                            alt=""
                        />
                    </Col>
                    <Col md={6}>
                        <ListGroup>
                            <ListGroup.Item>Nom du jeux</ListGroup.Item>
                            <ListGroup.Item>
                                Créé par : Nom auteur
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default DetailSalon;
