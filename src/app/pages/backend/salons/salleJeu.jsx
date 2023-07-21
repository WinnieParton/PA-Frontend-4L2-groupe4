import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ChatRoom from '../../../components/chat/ChatRoom';
import GuessingGame from '../../../components/game/GuessingGame';
import Morpion from '../../../components/game/Morpion';
import PierrePapierCiseaux from '../../../components/game/PierrePapierCiseaux';
import appRoutes from '../../../routes/routes';
const SalleJeu = () => {
    const navigate = useNavigate();
    const lobby: {
        id?: any;
        name?: string;
        game?: {
            miniature?: string;
            name?: string;
            maxPlayers?: number;
            minPlayers?: number;
            gameFiles?: string;
        };
        status?: string;
        creator?: any;
        participants?: [{ id?: any; name?: string }];
    } = JSON.parse(localStorage.getItem('info')).info;
    const [startGame, setStartGame] = useState(false);

    const handleLoadLobby = async () => {
        return navigate(appRoutes.SALONS);
    };
    const handleStart = () => {
        setStartGame(true);
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
                    <Col md={12}>
                        <h2>{lobby.name}</h2>
                    </Col>
                    <Col md={lobby.game.minPlayers > 1 ? 8 : 12}>
                        <div
                            className="jeux-content  d-flex justify-content-center align-items-center"
                            style={{
                                background: !startGame
                                    ? '#3f51b54a'
                                    : 'transparent',
                            }}
                        >
                            {startGame ? (
                                <div
                                    className="mt-4 mb-4"
                                    style={{ position: 'absolute' }}
                                >
                                    {lobby.game.gameFiles.includes(
                                        'morpion'
                                    ) ? (
                                        <Morpion />
                                    ) : lobby.game.gameFiles.includes(
                                          'Guessing'
                                      ) ? (
                                        <GuessingGame />
                                    ) : lobby.game.gameFiles.includes(
                                          'PierrePapier'
                                      ) ? (
                                        <PierrePapierCiseaux />
                                    ) : (
                                        <p>
                                            Le jeu n'est pas encore implementé
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <Button variant="primary" onClick={handleStart}>
                                    Jouer
                                </Button>
                            )}
                        </div>
                    </Col>
                    <Col
                        md={lobby.game.minPlayers > 1 ? 4 : 0}
                        className="chat-box"
                    >
                        {lobby.game.minPlayers > 1 && <ChatRoom />}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SalleJeu;
