import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cheese from '../../../components/game/cheese/Cheese';
import ChatRoom from '../../../components/chat/ChatRoom';

import appRoutes from '../../../routes/routes';
import { redirectOnLobby } from '../../../service/frontendService';
import Morpion from '../../../components/game/morpion/Morpion';
const SalleJeu = () => {
    const navigate = useNavigate();
    const lobby: {
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
    } = JSON.parse(localStorage.getItem('info')).info;

    const handleLoadLobby = async () => {
        const results = await redirectOnLobby(lobby.id);
        return navigate(appRoutes.SALONS);
    };

    return (
        <div className="container-fluid mt-5 pt-2">
            <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
                <div>
                    <h2>{lobby?.game?.name}</h2>
                </div>
                <div>
                    <Button variant="primary" onClick={handleLoadLobby}>
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
                                {lobby.game.name === 'Cheese' ? (
                                    <Cheese />
                                ) : lobby.game.name === 'Morpion' ? (
                                    <Morpion />
                                ) : (
                                    <p>Le jeu n'est pas encore implementé</p>
                                )}
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <ChatRoom />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SalleJeu;
