import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { SaveScore, runEngine } from '../../service/frontendService';

const Morpion = () => {
    const [gameData, setGameData] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    let call = 0;
    useEffect(() => {
        const data = {
            init: {
                players: 2,
            },
        };
        if (call == 0) {
            call++;
            handleGame(data);
        }
    }, []);

    const handleGame = async (data) => {
        try {
            const idLobby = JSON.parse(localStorage.getItem('info')).info.id;
            const results = await runEngine(idLobby, data);
            if (results.game_state?.game_over) {
                setGameOver(true);
                let winnerId = 0;
                let lostId = 0;
                if (
                    (JSON.parse(localStorage.getItem('auth')).userid ==
                        JSON.parse(localStorage.getItem('info')).info.creator
                            .id &&
                        results.requested_actions[0].player === 2) ||
                    (JSON.parse(localStorage.getItem('auth')).userid !=
                        JSON.parse(localStorage.getItem('info')).info.creator
                            .id &&
                        results.requested_actions[0].player === 1)
                ) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Gagnant',
                        showCancelButton: true,
                        text: `Félicitation vous avez gagné.`,
                        confirmButtonText: 'Nouvelle partie',
                        cancelButtonText: `Fermer`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                    winnerId = JSON.parse(localStorage.getItem('auth')).userid;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Game Over',
                        showCancelButton: true,
                        text: 'Une revenge?',
                        confirmButtonText: 'Nouvelle partie',
                        cancelButtonText: `Fermer`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                    if (
                        JSON.parse(localStorage.getItem('auth')).userid ==
                            JSON.parse(localStorage.getItem('info')).info
                                .creator.id &&
                        results.requested_actions[0].player === 1
                    ) {
                        winnerId =
                            JSON.parse(localStorage.getItem('auth')).userid !=
                            JSON.parse(localStorage.getItem('info')).info
                                .participants[0].id
                                ? JSON.parse(localStorage.getItem('info')).info
                                      .participants[0].id
                                : JSON.parse(localStorage.getItem('info')).info
                                      .participants[1].id;
                    } else
                        winnerId = JSON.parse(localStorage.getItem('info')).info
                            .creator.id;
                }
                lostId =
                    winnerId != JSON.parse(localStorage.getItem('auth')).userid
                        ? JSON.parse(localStorage.getItem('auth')).userid
                        : winnerId !=
                          JSON.parse(localStorage.getItem('info')).info
                              .participants[0].id
                        ? JSON.parse(localStorage.getItem('info')).info
                              .participants[0].id
                        : JSON.parse(localStorage.getItem('info')).info
                              .participants[1].id;

                const newScores = new Map();
                newScores.set(winnerId, 1.0);
                newScores.set(lostId, 0.0);
                const datascore = {
                    winnerId: winnerId,
                    scoresByPlayers: JSON.stringify([...newScores]),
                };
                const score = await SaveScore(idLobby, datascore);
            }

            setGameData(results);
        } catch (error) {
            console.error("Une erreur s'est produite:", error);
        }
    };

    const handleZoneClick = (zone) => {
        console.log('zone' + zone);

        if (gameOver) return;
        const data = {
            actions: [
                {
                    type: 'CLICK',
                    player: gameData.requested_actions[0].player,
                    x: zone.x,
                    y: zone.y,
                    width: zone.width,
                    height: zone.height,
                },
            ],
        };
        handleGame(data);
    };

    return (
        <div>
            <div>
                <svg
                    width={gameData?.displays[0].width}
                    height={gameData?.displays[0].height}
                >
                    {gameData?.displays
                        .flatMap((display) => display.content)
                        .map((item, itemIndex) => {
                            if (item.tag === 'style') {
                                return (
                                    <style key={itemIndex}>
                                        {item.content}
                                    </style>
                                );
                            } else if (item.tag === 'line') {
                                return (
                                    <line
                                        key={itemIndex}
                                        x1={item.x1}
                                        y1={item.y1}
                                        x2={item.x2}
                                        y2={item.y2}
                                    />
                                );
                            } else if (item.tag === 'circle') {
                                return (
                                    <circle
                                        key={itemIndex}
                                        cx={item.cx}
                                        cy={item.cy}
                                        r={item.r}
                                        fill={item.fill}
                                    />
                                );
                            }
                            return null;
                        })}
                </svg>
                <p>Player: {gameData?.displays[0].player}</p>
            </div>
            {gameData?.requested_actions.map((action, index) => (
                <div key={index}>
                    <p>Type: {action.type}</p>
                    <p>Player: {action.player}</p>
                    {action.zones.map((zone, zoneIndex) => (
                        <div
                            key={zoneIndex}
                            style={{
                                position: 'absolute',
                                top: zone.y,
                                left: zone.x,
                                width: zone.width,
                                height: zone.height,
                            }}
                            onClick={() => handleZoneClick(zone)}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );
};
export default Morpion;
