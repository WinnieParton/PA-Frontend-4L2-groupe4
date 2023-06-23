import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import {
    PlayGame,
    getCircularReplacer,
} from '../../../service/frontendService';
import BoardComponent from './components/BoardComponent/BoardComponent';
import PlayerComponent from './components/PlayerComponent/PlayerComponent';
import { Board } from './models/Board';
import { Colors } from './models/Colors';
import { Player } from './models/Player';
import { King } from './models/figures/King';
import './scss/index.scss';

const Cheese = () => {
    const [board, setBoard] = useState(new Board());
    const [bo, setBo] = useState(null);
    const [whitePlayer] = useState(new Player(Colors.WHITE));
    const [blackPlayer] = useState(new Player(Colors.BLACK));
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [show, setShow] = useState(false);
    const [result, setResult] = useState<{
        player1: string;
        player2: string;
        board: any;
        currentPlayer: string;
        statusGame: string;
    }>(null);

    var nb = 0;

    useEffect(() => {
        restart();
    }, []);
    useEffect(() => {
        console.log('result', result);
    }, [result]);

    useEffect(() => {
        console.log('board');
    }, [board]);

    function restart() {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
        if (nb == 0) {
            handleStartGame(newBoard);
            nb++;
        }
    }
    const handleStartGame = async (newBoard) => {
        const lobby: {
            id?: any;
            name?: string;
            game?: {
                miniature?: string;
                name?: string;
                maxPlayers?: number;
                minPlayers?: string;
                id?: number;
            };
            status?: string;
            creator?: any;
            participants?: any;
        } = JSON.parse(localStorage.getItem('info')).info;

        const data: {
            player1: string;
            player2: string;
            board: any;
            currentPlayer: string;
            statusGame: string;
        } = {
            player1: lobby.creator.name,
            player2:
                lobby.creator.name != lobby.participants[0].name
                    ? lobby.participants[0].name
                    : lobby.participants[1].name,
            board: JSON.stringify(newBoard, getCircularReplacer()),
            currentPlayer: 'white',
            statusGame: 'STARTED',
        };
        // setResult(data);

        try {
            const results = await PlayGame(lobby.game.id, lobby.id, data);
            localStorage.setItem(
                'currentgame',
                JSON.stringify({ currentgame: results })
            );
            setResult(results);
        } catch (error) {
            // Gérer l'erreur ici
            console.error("Une erreur s'est produite:", error);
        }
    };

    function swapPlayer() {
        setCurrentPlayer(
            currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer
        );
    }
    function setStatusGame(b) {
        console.log('b?.lostBlackFigures', b?.lostBlackFigures);
        setShow(
            b?.lostBlackFigures.length == 16 ||
                b?.lostWhiteFigures.length == 16 ||
                b?.lostBlackFigures.some((obj) => obj instanceof King) ||
                b?.lostWhiteFigures.some((obj) => obj instanceof King)
        );
        setBo(b);
    }
    const handleClose = () => setShow(false);
    return (
        <div className="app">
            <PlayerComponent
                player={
                    JSON.parse(localStorage.getItem('auth')).userid ==
                    JSON.parse(localStorage.getItem('info')).info.creator.id
                        ? blackPlayer
                        : whitePlayer
                }
                lostFigures={
                    JSON.parse(localStorage.getItem('auth')).userid ==
                    JSON.parse(localStorage.getItem('info')).info.creator.id
                        ? board.lostBlackFigures
                        : board.lostWhiteFigures
                }
                currentPlayer={currentPlayer}
            />
            <BoardComponent
                board={board}
                setBoard={setBoard}
                currentPlayer={currentPlayer}
                swapPlayer={swapPlayer}
                setStatusGame={setStatusGame}
            />
            <PlayerComponent
                player={
                    JSON.parse(localStorage.getItem('auth')).userid ==
                    JSON.parse(localStorage.getItem('info')).info.creator.id
                        ? whitePlayer
                        : blackPlayer
                }
                lostFigures={
                    JSON.parse(localStorage.getItem('auth')).userid ==
                    JSON.parse(localStorage.getItem('info')).info.creator.id
                        ? board.lostWhiteFigures
                        : board.lostBlackFigures
                }
                currentPlayer={currentPlayer}
            />
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Fin de la partie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentPlayer?.color == 'black' ? (
                        <>
                            {JSON.parse(localStorage.getItem('currentgame'))
                                ?.currentgame?.player1 == result?.player1 ? (
                                <>
                                    Félicitation {result?.player1} .Vous avez
                                    gagné avec{' '}
                                    {bo?.currentPlayer == 'black'
                                        ? 16 - bo?.lostBlackFigures.length
                                        : 16 - bo?.lostWhiteFigures.length}{' '}
                                    piong(s) sur le tableau
                                </>
                            ) : (
                                <>Game Over</>
                            )}
                        </>
                    ) : (
                        <>
                            {JSON.parse(localStorage.getItem('currentgame'))
                                ?.currentgame?.player2 == result?.player2 ? (
                                <>
                                    Félicitation {result?.player2} .Vous avez
                                    gagné avec{' '}
                                    {bo?.currentPlayer == 'black'
                                        ? 16 - bo?.lostBlackFigures.length
                                        : 16 - bo?.lostWhiteFigures.length}{' '}
                                    piong(s) sur le tableau
                                </>
                            ) : (
                                <>Game Over</>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => window.location.reload()}
                    >
                        Nouvelle Partie
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default Cheese;
