import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import appRoutes from '../../../routes/routes';
import { useParams } from 'react-router-dom';
import Cheese from '../../../components/game/cheese/Cheese';
const SalleJeu = () => {
    const [lobby, setLobby] = useState<{
        id?: any;
        name?: string;
        game?: {
            miniature?: string;
            name?: string;
            maxPlayers?: number;
            minPlayers?: string;
        };
        status?: string;
        creator?: any;
        participants?: [{ id?: any; name?: string }];
    }>(JSON.parse(localStorage.getItem('info')).info);


    return (
        <div className="container-fluid mt-5 pt-2">
            <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
                <div>
                    <h2>{lobby?.game?.name}</h2>
                </div>
                <div>
                    <Button variant="primary" href={appRoutes.SALONS}>
                        Retour
                    </Button>
                </div>
            </div>
            <div className="bg-light p-2 my-2">
                <Row>
                    <Col md={8}>
                        <div className="jeux-content">
                            <h2>{lobby.name}</h2>
                            <div className="d-flex mt-4 mb-4 justify-content-center">
                                {lobby.game.name == 'Cheese' ? (
                                    <Cheese />
                                ) : (
                                    <p>Le jeu n'est pas encore implementé</p>
                                )}
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="tchat-content">
                            <div className="message-content">
                                <div className="message-sender">Salut</div>
                                <div className="message-receiver">
                                    Salut ça va?
                                </div>
                            </div>
                            <div className="input-message">
                                <input
                                    type="text"
                                    placeholder="Entre votre message..."
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SalleJeu;
