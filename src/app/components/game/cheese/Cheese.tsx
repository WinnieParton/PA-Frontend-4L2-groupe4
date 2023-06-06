import BoardComponent from './components/BoardComponent/BoardComponent';
import PlayerComponent from './components/PlayerComponent/PlayerComponent';
import { Board } from './models/Board';
import { Colors } from './models/Colors';
import { Player } from './models/Player';
import { useEffect, useState } from 'react';
import './scss/index.scss';

const Cheese = () => {
    const [board, setBoard] = useState(new Board());
    const [whitePlayer] = useState(new Player(Colors.WHITE));
    const [blackPlayer] = useState(new Player(Colors.BLACK));
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

    useEffect(() => {
        restart();
    }, []);

    function restart() {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
    }

    function swapPlayer() {
        setCurrentPlayer(
            currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer
        );
    }

    return (
        <>
            {JSON.parse(localStorage.getItem('auth')).userid ==
            JSON.parse(localStorage.getItem('info')).info.creator.id ? (
                <div className="app">
                    <PlayerComponent
                        player={blackPlayer}
                        lostFigures={board.lostBlackFigures}
                        currentPlayer={currentPlayer}
                    />
                    <BoardComponent
                        board={board}
                        setBoard={setBoard}
                        currentPlayer={currentPlayer}
                        swapPlayer={swapPlayer}
                    />
                    <PlayerComponent
                        player={whitePlayer}
                        lostFigures={board.lostWhiteFigures}
                        currentPlayer={currentPlayer}
                    />
                </div>
            ) : (
                <div className="app">
                    <PlayerComponent
                        player={whitePlayer}
                        lostFigures={board.lostWhiteFigures}
                        currentPlayer={currentPlayer}
                    />
                    <BoardComponent
                        board={board}
                        setBoard={setBoard}
                        currentPlayer={currentPlayer}
                        swapPlayer={swapPlayer}
                    />
                    <PlayerComponent
                        player={blackPlayer}
                        lostFigures={board.lostBlackFigures}
                        currentPlayer={currentPlayer}
                    />
                </div>
            )}
        </>
    );
};
export default Cheese;
