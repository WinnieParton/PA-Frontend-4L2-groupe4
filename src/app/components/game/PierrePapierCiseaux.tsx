import { useEffect, useState } from 'react';
import { SaveScore, runEngine } from '../../service/frontendService';
import Swal from 'sweetalert2';
import { baseURL } from '../../../environnements/environnement';
import SockJS from 'sockjs-client/dist/sockjs';
import { over } from 'stompjs';

var stompClient = null;
const PierrePapierCiseaux = () => {
    const [gameData, setGameData] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const idLobby = JSON.parse(localStorage.getItem('info')).info.id;
    const [userData, setUserData] = useState({
        username: JSON.parse(localStorage.getItem('auth')).userName,
        receivername:
            JSON.parse(localStorage.getItem('auth')).userid !=
            JSON.parse(localStorage.getItem('info')).info.participants[0].id
                ? JSON.parse(localStorage.getItem('info')).info.participants[0]
                      .name
                : JSON.parse(localStorage.getItem('info')).info.participants[1]
                      .name,
        senderUser: JSON.parse(localStorage.getItem('auth')).userid,
        lobby: JSON.parse(localStorage.getItem('info')).info.id,
        connected: false,
    });
    const [clickAction, setClickAction] = useState(
        JSON.parse(localStorage.getItem('auth')).userid ==
            JSON.parse(localStorage.getItem('info')).info.creator.id
    );
    let call = 0;

    const hanldeClick = (value) => {
        if (gameOver) return;
        const data = { actions: { value: value } };
        handleGame(data);
    };

    useEffect(() => {
        connect();
    }, []);

    useEffect(() => {}, [gameData, clickAction]);

    const connect = () => {
        let Sock = new SockJS(`${baseURL}/ws`);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };
    const onConnected = () => {
        setUserData({ ...userData, connected: true });
        stompClient.subscribe('/game/lobby', onMessageReceived);
        stompClient.subscribe(
            '/user/' + userData.username + '/game',
            onPrivateMessage
        );
        userJoin();
    };
    const onMessageReceived = (payload) => {
        var payloadData =
            payload.body != '' ? JSON.parse(payload.body) : payload.body;

        if (payloadData == '') {
            const data = {
                init: {
                    players: 2,
                },
            };
            if (call == 0) {
                call++;
                handleGame(data);
            }
        } else setGameData(payloadData);
    };
    const onPrivateMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        var oldGameState = gameData;
        if (oldGameState != payloadData) {
            handleResult(payloadData);
        }
    };

    const userJoin = () => {
        var chatMessage = {
            lobby: userData.lobby,
        };
        stompClient.send('/app/game', {}, JSON.stringify(chatMessage));
    };
    const onError = (err) => {
        connect();
    };

    const handleGame = async (data) => {
        try {
            const results = await runEngine(idLobby, data);
            return handleResult(results);
        } catch (error) {
            console.error("Une erreur s'est produite:", error);
        }
    };
    const handleResult = async (results) => {
        if (results?.gam_over) {
            setGameOver(true);
            setClickAction(true);
            let winnerId = 0;
            let lostId = 0;
            if (
                (JSON.parse(localStorage.getItem('auth')).userid ==
                    JSON.parse(localStorage.getItem('info')).info.creator.id &&
                    results.result.winner == 'joueur1') ||
                (JSON.parse(localStorage.getItem('auth')).userid !=
                    JSON.parse(localStorage.getItem('info')).info.creator.id &&
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
                        JSON.parse(localStorage.getItem('info')).info.creator
                            .id &&
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
        setGameData(results);
        setClickAction(
            (JSON.parse(localStorage.getItem('auth')).userid ==
                JSON.parse(localStorage.getItem('info')).info.creator.id &&
                (results?.message.includes('Joueur 1') ||
                    results?.result.winner.includes('joueur1'))) ||
                (JSON.parse(localStorage.getItem('auth')).userid !=
                    JSON.parse(localStorage.getItem('info')).info.creator.id &&
                    (results?.message.includes('Joueur 2') ||
                        results?.result.winner.includes('joueur2')))
        );
    };
    return (
        <div
            style={{
                pointerEvents: clickAction ? 'initial' : 'none',
            }}
        >
            <h2 className="mb-2 text-center fw-bold">{gameData?.message}</h2>
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
