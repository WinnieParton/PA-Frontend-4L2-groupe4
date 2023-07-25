import { createElement, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import { baseURL } from "../../../environnements/environnement";
import {
  getLastStateGame,
  runEngine,
  SaveScore,
} from "../../service/frontendService";
import Swal from "sweetalert2";

const Game = (props) => {
  let stompClient = null;
  let isGameSaved = useRef(false);
  let call = 0;

  const lobby = props.lobby;
  const idLobby = lobby.id;
  const authInfo = JSON.parse(localStorage.getItem("auth"));

  const [gameData, setGameData] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [clickAction, setClickAction] = useState(
    authInfo.userid == lobby.creator.id
  );
  const [userData, setUserData] = useState({
    username: authInfo.userName,
    receivername: lobby.participants.map((user) => {
      if (user.id == authInfo.userid) return user.name;
    }),
    senderUser: authInfo.userid,
    lobby: lobby.id,
    connected: false,
  });

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
    stompClient.subscribe("/game/lobby", onMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/game",
      onPrivateMessage
    );
    userJoin();
  };

  const onMessageReceived = (payload) => {
    const payloadData =
      payload.body != "" ? JSON.parse(payload.body) : payload.body;
    if (payloadData == "") {
      const data = {
        init: {
          players: lobby.participants.length,
        },
      };
      if (call == 0) {
        call++;
        handleGame(data, "received").catch((error) => console.log(error));
      }
    } else {
      setGameData(payloadData);
      setClickAction(
        authInfo?.userid ===
          lobby?.participants[payloadData?.requested_actions[0].player - 1].id
      );
    }
  };

  const onPrivateMessage = (payload) => {
    let payloadData = JSON.parse(payload.body);
    if (gameData != payloadData) {
      handleResult(payloadData, "received").catch((error) =>
        console.log(error)
      );
    }
  };

  const userJoin = () => {
    let chatMessage = { lobby: userData.lobby };
    stompClient.send("/app/game", {}, JSON.stringify(chatMessage));
    props.setStart(true);
  };

  const onError = (err) => {
    console.log(err);
    connect();
  };

  const handleGame = async (data, action) => {
    try {
      const results = await runEngine(idLobby, data);
      return handleResult(results, action);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGameLastState = async () => {
    try {
      const results = await getLastStateGame(idLobby);
      setGameData(results);
      setClickAction(
        authInfo.userid ===
          lobby.participants[results?.requested_actions[0].player - 1].id
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleZoneClick = (zone) => {
    if (gameOver) return;
    const data = {
      actions: [
        {
          type: "CLICK",
          player: gameData.requested_actions[0].player,
          x: zone.x,
          y: zone.y,
          width: zone.width,
          height: zone.height,
        },
      ],
    };
    handleGame(data, "onclick").catch((error) => console.log(error));
  };

  const handleEndGame = async (results, action) => {
    setClickAction(true);
    setGameOver(true);

    let winnerId;
    let lostId;

    if (
      lobby.participants[results?.requested_actions[0].player - 2] == undefined
    ) {
      winnerId = lobby?.participants[0].id;
    } else {
      winnerId = lobby?.participants[results.requested_actions[0].player - 2].id;
    }
    lostId = lobby.participants.filter((user) => user.id != winnerId);
    if (authInfo.userid == winnerId) {
      Swal.fire({
        icon: "success",
        title: "Gagnant",
        showCancelButton: true,
        text: `Félicitation vous avez gagné.`,
        confirmButtonText: "Nouvelle partie",
        cancelButtonText: `Fermer`,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("Dialog closed by cancel button");
          handleGameLastState();
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Game Over",
        showCancelButton: true,
        text: "Une revenge?",
        confirmButtonText: "Nouvelle partie",
        cancelButtonText: `Fermer`,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          handleGameLastState();
        }
      });
    }

    const newScores = new Map();
    newScores.set(winnerId, 1.0);
    lostId.forEach((user) => newScores.set(user.id, 0.0));
    const datascore = {
      winnerId: winnerId,
      scoresByPlayers: JSON.stringify([...newScores]),
    };
    if (action != "onclick")
      if (!isGameSaved.current) {
        isGameSaved.current = true;
        return saveScore(datascore);
      }
  };

  const handleResult = async (results, action) => {
    if (results.game_state?.game_over) {
      handleEndGame(results, action).catch((error) => console.log(error));
    }
    setGameData(results);
    setClickAction(
      authInfo?.userid ==
        lobby?.participants[results?.requested_actions[0]?.player - 1].id
    );
  };

  const saveScore = async (datascore) => {
    return await SaveScore(idLobby, datascore);
  };

  return (
    <>
      {gameData &&
      gameData.displays != undefined &&
      gameData.displays.length > 0 ? (
        <div
          style={{
            pointerEvents: clickAction ? "initial" : "none",
          }}
        >
          <svg
            height={gameData?.displays[0].height}
            width={gameData?.displays[0].width}
          >
            {gameData?.displays
              ?.flatMap((display) => display.content)
              .map((item, index) => {
                return createElement(
                  item.tag,
                  {
                    key: index,
                    x: item?.x,
                    x1: item?.x1,
                    x2: item?.x2,
                    y: item?.y,
                    y1: item?.y1,
                    y2: item?.y2,
                    cx: item?.cx,
                    cy: item?.cy,
                    r: item?.r,
                    href: item?.href,
                    width: item?.width,
                    height: item?.height,
                    fill: item?.fill,
                  },
                  item?.content
                );
              })}
          </svg>
          {gameData?.requested_actions.map((action, index) => (
            <div key={index}>
              <p>Action: {action?.type}</p>
              <p>Player: {lobby?.participants[action.player - 1]?.name}</p>

              <div key={index}>
                {action?.zones?.map((zone, zoneIndex) => (
                  <div
                    key={zoneIndex}
                    style={{
                      position: "absolute",
                      top: zone.y,
                      left: zone.x,
                      width: zone.width,
                      height: zone.height,
                    }}
                    onClick={() => handleZoneClick(zone)}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Game;
