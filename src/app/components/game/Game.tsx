import {useEffect, useState} from "react";
import SockJS from 'sockjs-client/dist/sockjs';
import {over} from 'stompjs';
import {baseURL} from "../../../environnements/environnement";
import {getLastStateGame, runEngine} from "../../service/frontendService";

const Game = (props) => {

    let stompClient = null;

    const lobby = props.lobby;
    const idLobby = lobby.id;
    const authInfo = JSON.parse(localStorage.getItem('auth'));

    const [gameData, setGameData] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [userData, setUserData] = useState({
        username: authInfo.userName,
        receivername:
            lobby.participants.map(user => {
                if (user.id == authInfo.userid) return user.name
            }),
        senderUser: authInfo.userid,
        lobby: lobby.id,
        connected: false,
    });
    const [clickAction, setClickAction] = useState(authInfo.userid == lobby.creator.id);

    let call = 0;

    useEffect(() => {
        connect();
    }, []);
    useEffect(() => {
    }, [gameData, clickAction]);

    const connect = () => {
        let Sock = new SockJS(`${baseURL}/ws`);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        setUserData({...userData, connected: true});
        stompClient.subscribe('/game/lobby', onMessageReceived);
        stompClient.subscribe(
            '/user/' + userData.username + '/game',
            onPrivateMessage
        );
        userJoin();
    };

    const onMessageReceived = (payload) => {
        const payloadData = payload.body != '' ? JSON.parse(payload.body) : payload.body;
        if (payloadData == '') {
            const data = {
                init: {
                    players: lobby.participants.length,
                },
            };
            if (call == 0) {
                call++;
                handleGame(data);
            }
        } else setGameData(payloadData);
    };

    const onPrivateMessage = (payload) => {
        let payloadData = JSON.parse(payload.body);
        if (gameData != payloadData) {
            handleResult(payloadData);
        }
    };

    const userJoin = () => {
        let chatMessage = {
            lobby: userData.lobby,
        };
        stompClient.send('/app/game', {}, JSON.stringify(chatMessage));
    };

    const onError = (err) => {
        console.log(err);
        connect();
    };

    const handleGame = async (data) => {
        try {
            const results = await runEngine(idLobby, data);
            return handleResult(results);
        } catch (error) {}
    };

    const handleGameLastState = async () => {
        try {
            const results = await getLastStateGame(idLobby);
            setGameData(results);
            setClickAction(false);
        } catch (error) {}
    };

    const handleZoneClick = (zone) => {
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



    return (<></>)
}
export default Game;