import { FC, Fragment, useEffect, useState } from 'react';
import { Board } from '../../models/Board';
import { Cell } from '../../models/Cell';
import { Player } from '../../models/Player';
import CellComponent from '../CellComponent/CellComponent';
import style from './BoardComponent.module.scss';

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player | null;
    swapPlayer: () => void;
    setStatusGame: (board) => void;
}

const BoardComponent: FC<BoardProps> = ({
    board,
    setBoard,
    currentPlayer,
    swapPlayer,
    setStatusGame,
}) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

    const click = (cell: Cell) => {
        if (
            selectedCell &&
            selectedCell !== cell &&
            selectedCell.figure?.canMove(cell)
        ) {
            localStorage.setItem('currentPlayer', currentPlayer?.color);
            var board = selectedCell.moveFigure(cell);
            swapPlayer();
            setSelectedCell(null);
            setStatusGame(board);
        } else {
            if (cell.figure?.color === currentPlayer?.color) {
                setSelectedCell(cell);
            }
        }
    };

    const updateBoard = () => {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    };

    const highLightCells = () => {
        board.highLightCells(selectedCell);
        updateBoard();
    };

    useEffect(() => {
        highLightCells();
    }, [selectedCell]);

    return (
        <div className={style.board}>
            {board.cells.map((row, i) => (
                <Fragment key={i}>
                    {row.map((cell) => (
                        <CellComponent
                            cell={cell}
                            click={click}
                            selected={
                                cell.x === selectedCell?.x &&
                                cell.y === selectedCell?.y
                            }
                            key={cell.id}
                        />
                    ))}
                </Fragment>
            ))}
        </div>
    );
};
export default BoardComponent;
