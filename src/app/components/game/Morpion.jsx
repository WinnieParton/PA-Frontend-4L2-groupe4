import React, { useEffect, useRef, useState } from "react";

import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import Swal from "sweetalert2";
import { baseURL } from "../../../environnements/environnement";
import {
  SaveScore,
  getLastStateGame,
  runEngine,
} from "../../service/frontendService";

var stompClient = null;
const Morpion = ({ start }) => {
  const [gameData, setGameData] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [userData, setUserData] = useState({
    username: JSON.parse(localStorage.getItem("auth")).userName,
    receivername:
      JSON.parse(localStorage.getItem("auth")).userid !=
      JSON.parse(localStorage.getItem("info")).info.participants[0].id
        ? JSON.parse(localStorage.getItem("info")).info.participants[0]?.name
        : JSON.parse(localStorage.getItem("info")).info.participants[1]?.name,
    senderUser: JSON.parse(localStorage.getItem("auth")).userid,
    lobby: JSON.parse(localStorage.getItem("info")).info.id,
    connected: false,
  });
  const idLobby = JSON.parse(localStorage.getItem("info")).info.id;
  const [clickAction, setClickAction] = useState(
    JSON.parse(localStorage.getItem("auth")).userid ==
      JSON.parse(localStorage.getItem("info")).info.creator.id
  );

  let call = 0;
  let isGameSaved = useRef(false);
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
    var payloadData =
      payload.body != "" ? JSON.parse(payload.body) : payload.body;
    if (payloadData == "") {
      const data = {
        init: {
          players: 2,
        },
      };
      if (call == 0) {
        call++;
        handleGame(data, "received");
      }
    } else {
      setGameData(payloadData);
      setClickAction(
        (JSON.parse(localStorage.getItem("auth")).userid ==
          JSON.parse(localStorage.getItem("info")).info.creator.id &&
          payloadData?.requested_actions[0].player == 1) ||
          (JSON.parse(localStorage.getItem("auth")).userid !=
            JSON.parse(localStorage.getItem("info")).info.creator.id &&
            payloadData.requested_actions[0].player == 2)
      );
    }
  };
  const onPrivateMessage = (payload) => {
    var payloadData = JSON.parse(payload.body);
    var oldGameState = gameData;
    if (oldGameState != payloadData) {
      handleResult(payloadData, "received");
    }
  };

  const userJoin = () => {
    var chatMessage = {
      lobby: userData.lobby,
    };
    stompClient.send("/app/game", {}, JSON.stringify(chatMessage));
    start();
  };
  const onError = (err) => {
    connect();
  };

  const handleGame = async (data, action) => {
    try {
      const results = await runEngine(idLobby, data);
      return handleResult(results, action);
    } catch (error) {}
  };
  const handleGameLastState = async () => {
    try {
      const results = await getLastStateGame(idLobby);
      setGameData(results);
      setClickAction(
        (JSON.parse(localStorage.getItem("auth")).userid ==
          JSON.parse(localStorage.getItem("info")).info.creator.id &&
          results?.requested_actions[0].player == 1) ||
          (JSON.parse(localStorage.getItem("auth")).userid !=
            JSON.parse(localStorage.getItem("info")).info.creator.id &&
            results.requested_actions[0].player == 2)
      );
    } catch (error) {}
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
    handleGame(data, "onclick");
  };
  const handleResult = async (results, action) => {
    if (results?.game_state?.game_over) {
      setClickAction(true);
      setGameOver(true);
      let winnerId = 0;
      let lostId = 0;
      if (
        (JSON.parse(localStorage.getItem("auth")).userid ==
          JSON.parse(localStorage.getItem("info")).info.creator.id &&
          results.requested_actions[0].player === 2) ||
        (JSON.parse(localStorage.getItem("auth")).userid !=
          JSON.parse(localStorage.getItem("info")).info.creator.id &&
          results.requested_actions[0].player === 1)
      ) {
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
        winnerId = JSON.parse(localStorage.getItem("auth")).userid;
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
        if (
          JSON.parse(localStorage.getItem("auth")).userid ==
            JSON.parse(localStorage.getItem("info")).info.creator.id &&
          results.requested_actions[0].player === 1
        ) {
          winnerId =
            JSON.parse(localStorage.getItem("auth")).userid !=
            JSON.parse(localStorage.getItem("info")).info.participants[0].id
              ? JSON.parse(localStorage.getItem("info")).info.participants[0].id
              : JSON.parse(localStorage.getItem("info")).info.participants[1]
                  .id;
        } else
          winnerId = JSON.parse(localStorage.getItem("info")).info.creator.id;
      }
      lostId =
        winnerId != JSON.parse(localStorage.getItem("auth")).userid
          ? JSON.parse(localStorage.getItem("auth")).userid
          : winnerId !=
            JSON.parse(localStorage.getItem("info")).info.participants[0].id
          ? JSON.parse(localStorage.getItem("info")).info.participants[0].id
          : JSON.parse(localStorage.getItem("info")).info.participants[1].id;

      const newScores = new Map();
      newScores.set(winnerId, 1.0);
      newScores.set(lostId, 0.0);
      const datascore = {
        winnerId: winnerId,
        scoresByPlayers: JSON.stringify([...newScores]),
      };
      if (action != "onclick")
        if (!isGameSaved.current) {
          isGameSaved.current = true; // Set the flag to true to indicate the game is saved
          return saveScore(datascore);
        }
    }
    setGameData(results);
    setClickAction(
      (JSON.parse(localStorage.getItem("auth")).userid ==
        JSON.parse(localStorage.getItem("info")).info.creator.id &&
        results?.requested_actions[0]?.player == 1) ||
        (JSON.parse(localStorage.getItem("auth")).userid !=
          JSON.parse(localStorage.getItem("info")).info.creator.id &&
          results?.requested_actions[0]?.player == 2)
    );
  };

  const saveScore = async (datascore) => {
    return await SaveScore(idLobby, datascore);
  };

  return (
    <div
      style={{
        pointerEvents: clickAction ? "initial" : "none",
      }}
    >
      {gameData != null && gameData?.displays != null && (
        <>
          <div>
            <svg
              width={gameData?.displays[0].width}
              height={gameData?.displays[0].height}
            >
              {gameData?.displays
                .flatMap((display) => display.content)
                .map((item, itemIndex) => {
                  if (item.tag === "style") {
                    return <style key={itemIndex}>{item.content}</style>;
                  } else if (item.tag === "line") {
                    return (
                      <line
                        key={itemIndex}
                        x1={item.x1}
                        y1={item.y1}
                        x2={item.x2}
                        y2={item.y2}
                      />
                    );
                  } else if (item.tag === "circle") {
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
          </div>
          {gameData?.requested_actions.map((action, index) => (
            <div key={index}>
              <p>Type: {action.type}</p>
              <p>
                Player:{" "}
                {action.player == 1
                  ? JSON.parse(localStorage.getItem("info")).info
                      .participants[0]?.name
                  : JSON.parse(localStorage.getItem("info")).info
                      .participants[1]?.name}
              </p>

              {action.zones.map((zone, zoneIndex) => (
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
          ))}
        </>
      )}
    </div>
  );
};
export default Morpion;
