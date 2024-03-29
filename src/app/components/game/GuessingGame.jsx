import React, { useEffect, useState } from 'react';

import { SaveScore, runEngine } from '../../service/frontendService';
import Swal from 'sweetalert2';

const GuessingGame = () => {
    const [gameData, setGameData] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [inputText, setInputText] = useState('');
    let call = 0;
    let saveRanking = 0;
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
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleGame = async (data) => {
        try {
            const idLobby = JSON.parse(localStorage.getItem('info')).info.id;
            const results = await runEngine(idLobby, data);
            setGameData(results);

            if (results?.gam_over) {
                setGameOver(true);

                Swal.fire({
                    icon: 'success',
                    title: 'Gagnant',
                    showCancelButton: true,
                    text: results?.message,
                    confirmButtonText: 'Nouvelle partie',
                    cancelButtonText: `Fermer`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
                let winnerId = JSON.parse(localStorage.getItem('auth')).userid;
                const newScores = new Map();
                newScores.set(winnerId, results?.score);
                const datascore = {
                    winnerId: winnerId,
                    scoresByPlayers: JSON.stringify([...newScores]),
                };
                if (saveRanking == 0) {
                    saveRanking++;
                    const score = await SaveScore(idLobby, datascore);
                }
            }
        } catch (error) {
            console.error("Une erreur s'est produite:", error);
        }
    };
    const handleButtonClick = () => {
        if (gameOver) return;
        const data = { actions: { value: inputText } };
        handleGame(data);
    };

    return (
        <div>
            <p className="text-danger">{gameData?.message}</p>
            {gameData?.display.map((element, index) => {
                if (element.type === 'INPUT') {
                    return (
                        <input
                            key={index}
                            type="number"
                            style={element.style}
                            value={inputText}
                            onChange={handleInputChange}
                        />
                    );
                } else if (element.type === 'BUTTON') {
                    return (
                        <button
                            key={index}
                            style={element.style}
                            onClick={handleButtonClick}
                        >
                            {element.content}
                        </button>
                    );
                } else {
                    return null;
                }
            })}
        </div>
    );
};

export default GuessingGame;
