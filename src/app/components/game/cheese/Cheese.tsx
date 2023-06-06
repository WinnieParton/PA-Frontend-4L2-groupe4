import { useEffect, useState } from 'react';
import { PlayGame } from '../../../service/frontendService';
import BoardComponent from './components/BoardComponent/BoardComponent';
import PlayerComponent from './components/PlayerComponent/PlayerComponent';
import { Board } from './models/Board';
import { Colors } from './models/Colors';
import { Player } from './models/Player';
import './scss/index.scss';

const Cheese = () => {
    const [board, setBoard] = useState(new Board());
    const [whitePlayer] = useState(new Player(Colors.WHITE));
    const [blackPlayer] = useState(new Player(Colors.BLACK));
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    var nb = 0;

    useEffect(() => {
        restart();
    }, []);

    function restart() {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
        if (nb == 0) {
            console.log('frist load board', newBoard);
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
            participants?: [{ id?: any; name?: string }];
        } = JSON.parse(localStorage.getItem('info')).info;

        const data: {
            player1: string;
            player2: string;
            board: any;
            currentPlayer: string;
        } = {
            player1: lobby.creator.name,
            player2: lobby.participants[0].name,
            board: JSON.stringify(newBoard,  getCircularReplacer()),
            currentPlayer: 'white',
        };

        function getCircularReplacer() {
          const seen = new WeakSet();
          return (key, value) => {
            if (typeof value === 'object' && value !== null) {
              if (seen.has(value)) {
                return;
              }
              seen.add(value);
            }
            return value;
          };}
        try {
            const results = await PlayGame(lobby.game.id, lobby.id,!newBoard.whiteCheck && !newBoard.blackCheck , data);
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
        </div>
    );
};
export default Cheese;
