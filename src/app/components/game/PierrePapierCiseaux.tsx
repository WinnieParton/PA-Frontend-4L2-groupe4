import { useEffect, useState } from 'react';
import { SaveScore, runEngine } from '../../service/frontendService';
import Swal from 'sweetalert2';

const PierrePapierCiseaux = () => {
    const [gameData, setGameData] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const handleGame = async (data) => {
        try {
            const idLobby = JSON.parse(localStorage.getItem('info')).info.id;
            const results = await runEngine(idLobby, data);
            setGameData(results);

            if (results?.gam_over) {
                setGameOver(true);
                let winnerId = 0;
                let lostId = 0;
                if (
                    (JSON.parse(localStorage.getItem('auth')).userid ==
                        JSON.parse(localStorage.getItem('info')).info.creator
                            .id &&
                        results.result.winner == 'joueur1') ||
                    (JSON.parse(localStorage.getItem('auth')).userid !=
                        JSON.parse(localStorage.getItem('info')).info.creator
                            .id &&
                        results.result.winner == 'joueur2')
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
                        results.result.winner == 'joueur1'
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
        } catch (error) {
            console.error("Une erreur s'est produite:", error);
        }
    };
    const hanldeClick = (value) => {
        if (gameOver) return;
        const data = { actions: { value: value } };
        handleGame(data);
    };
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
    return (
        <div>
            <h2 className='mb-2 text-center fw-bold'>{gameData?.message}</h2>
            {gameData?.display.map((element, index) => {
                if (element.type === 'BUTTON') {
                    return (
                        <button
                            key={index}
                            onClick={() => hanldeClick(element.value)}
                            className="mx-2"
                        >
                            <img src={element.content.src} />
                        </button>
                    );
                }
            })}
        </div>
    );
};

export default PierrePapierCiseaux;
