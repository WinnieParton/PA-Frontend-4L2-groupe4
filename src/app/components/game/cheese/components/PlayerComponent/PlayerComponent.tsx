import { FC, useState } from 'react';
import { Figure } from '../../models/figures/Figure';
import { Player } from '../../models/Player';
import style from './PlayerComponent.module.scss';
import Timer from '../Timer/Timer';

interface PlayerComponentProps {
    player: Player | null;
    lostFigures: Figure[];
    currentPlayer: Player | null;
}

const PlayerComponent: FC<PlayerComponentProps> = (props) => {
    const { player, lostFigures, currentPlayer } = props;

    return (
        <div className={style.player}>
            {player?.color == 'white' &&
            JSON.parse(localStorage.getItem('auth')).userid ==
                JSON.parse(localStorage.getItem('info')).info.creator.id ? (
                <p>
                    {player?.color +
                        ' player (' +
                        JSON.parse(localStorage.getItem('info')).info.creator
                            .name +
                        ')'}
                </p>
            ) : (
                <p>
                    {player?.color +
                        ' player (' +
                        JSON.parse(localStorage.getItem('info')).info
                            .participants[0].name +
                        ')'}
                </p>
            )}

            <div className={style.lost}>
                {lostFigures.map((figure) => (
                    <div key={figure.id}>
                        {figure.logo && (
                            <img src={figure.logo} alt={figure.name} />
                        )}
                    </div>
                ))}
            </div>

            <Timer isCounting={currentPlayer?.color === player?.color} />
        </div>
    );
};

export default PlayerComponent;
