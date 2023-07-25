import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import ChatRoom from "../../../components/chat/ChatRoom";
import GuessingGame from "../../../components/game/GuessingGame";
import Morpion from "../../../components/game/Morpion";
import PierrePapierCiseaux from "../../../components/game/PierrePapierCiseaux";
import appRoutes from "../../../routes/routes";
import { actionMove, historyMove } from "../../../service/frontendService";
import { baseURL } from "../../../../environnements/environnement";
import { over } from "stompjs";
import Game from "../../../components/game/Game";

var stompClient = null;
var nbstart = 0;
const SalleJeu = () => {
  const navigate = useNavigate();
  const lobby = JSON.parse(localStorage.getItem("info")).info;
  const [startGame, setStartGame] = useState(false);
  const [historic, setHistoric] = useState([]);
  const [notifCallBack, setNotifCallBack] = useState({});
  const [start, setStart] = useState(false);
  const handleLoadLobby = async () => {
    return navigate(appRoutes.SALONS);
  };
  const handleStart = () => {
    setStartGame(true);
  };
  const askrollback = async (id, status) => {
    const results = await actionMove(
      JSON.parse(localStorage.getItem("auth")).userid,
      status,
      id
    );
    setNotifCallBack({});
  };
  const handleHistoric = (payload) => {
    setHistoric([]);
    var payloadData = JSON.parse(payload.body);
    let data = [];
    payloadData.moves.forEach((el) => {
      const gameState = JSON.parse(el.gameState);
      if (gameState?.actions && gameState?.actions.length > 0)
        data.push({
          ...el,
          action: {
            type: gameState?.actions[0].type,
            player: gameState?.actions[0].player,
          },
        });
    });
    setHistoric(data);
  };
  const handleNotificationRollback = (payload) => {
    setNotifCallBack({});
    var payloadData = JSON.parse(payload.body);
    setNotifCallBack(payloadData);
  };

  useEffect(() => {
    nbstart = 0;
    register();
  }, []);
  useEffect(() => {}, [historic]);
  useEffect(() => {}, [notifCallBack]);
  const register = () => {
    connect();
  };
  const connect = () => {
    let Sock = new SockJS(`${baseURL}/ws`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onError = (err) => {
    register();
  };
  useEffect(() => {
    if (nbstart == 0) {
      handleLoadMove();
    }
    nbstart += 1;
  }, [start]);
  const handleLoadMove = async () => {
    const results = await historyMove(
      JSON.parse(localStorage.getItem("info")).info.id
    );
    setHistoric([]);
    let data = [];
    results.moves.forEach((el) => {
      const gameState = JSON.parse(el.gameState);
      if (gameState?.actions && gameState?.actions.length > 0)
        data.push({
          ...el,
          action: {
            type: gameState?.actions[0].type,
            player: gameState?.actions[0].player,
          },
        });
    });
    setHistoric(data);
  };
  const onConnected = () => {
    stompClient.subscribe(
      "/user/" +
        JSON.parse(localStorage.getItem("auth")).userName +
        "/private/historic/move",
      handleHistoric
    );
    stompClient.subscribe(
      "/user/" +
        JSON.parse(localStorage.getItem("auth")).userName +
        "/private/rollback",
      handleNotificationRollback
    );
  };

  return (
    <div className="container-fluid mt-5 pt-2">
      <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
        <div>
          <h2>{lobby?.game?.name}</h2>
        </div>
        <div>
          <Button variant="primary" onClick={handleLoadLobby}>
            Retour
          </Button>
        </div>
      </div>
      <div className="bg-light p-2 my-2">
        <Row>
          <Col md={12}>
            <h2>{lobby.name}</h2>
          </Col>
          {notifCallBack?.id && notifCallBack?.status == "PENDING" && (
            <Col md={12}>
              <div
                className="d-flex bg-info my-4 p-2 align-items-center"
                style={{ justifyContent: "space-between" }}
              >
                <h3>
                  Vous avez recu une demande de roll back aux actions precedente
                </h3>
                <div
                  className="d-flex "
                  style={{ justifyContent: "space-between" }}
                >
                  <Button
                    variant="primary"
                    onClick={() => askrollback(notifCallBack?.id, "POP")}
                  >
                    Accepter
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => askrollback(notifCallBack.id, "UNPOP")}
                  >
                    Refuser
                  </Button>
                </div>
              </div>
            </Col>
          )}
          <div
            className={
              lobby.game.gameFiles.includes(".py") && historic.length > 0
                ? "chat-messages col-md-3 col-4"
                : "chat-messages d-none" ||
                  (!lobby.game.gameFiles.includes(".py") && "d-none")
            }
            style={{
              display:
                lobby.game.gameFiles.includes(".py") && historic.length > 0
                  ? "initial"
                  : "none",
            }}
          >
            <h2 className="py-2">Historique de la partie</h2>
            <ul class="list-group">
              {historic.length > 0 &&
                historic.map((mov, index) => (
                  <li
                    class={
                      mov?.action?.player == 1
                        ? "list-group-item bg-info"
                        : "list-group-item bg-danger text-white"
                    }
                    key={index}
                    onClick={() => askrollback(mov.id, "PENDING")}
                    style={{ cursor: "pointer" }}
                  >
                    <p>Type: {mov?.action?.type}</p>
                    <p>
                      Player:{" "}
                      {mov?.action?.player == 1
                        ? JSON.parse(localStorage.getItem("info")).info
                            .participants[0]?.name
                        : JSON.parse(localStorage.getItem("info")).info
                            .participants[1]?.name}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
          <div
            className={
              lobby.game.gameFiles.includes(".py") && historic.length > 0
                ? "col-md-5 col-8"
                : "col-md-8 col-12" || historic.length > 0
            }
          >
            <div
              className="jeux-content  d-flex justify-content-center align-items-center"
              style={{
                background: !startGame ? "#3f51b54a" : "transparent",
              }}
            >
              {startGame ? (
                <div className="mt-4 mb-4" style={{ position: "absolute" }}>
                  <Game setStart={setStart} lobby={lobby} />
                  {/* {lobby.game.gameFiles.includes("morpion") ? (
                    <Morpion setStart={setStart} />
                  ) : lobby.game.gameFiles.includes("Guessing") ? (
                    <GuessingGame />
                  ) : lobby.game.gameFiles.includes("PierrePapier") ? (
                    <PierrePapierCiseaux />
                  ) : (
                    <Morpion setStart={setStart} />
                  )} */}
                </div>
              ) : (
                <Button variant="primary" onClick={handleStart}>
                  Jouer
                </Button>
              )}
            </div>
          </div>
          <div
            className={
              lobby.game.minPlayers > 1 ? "chat-box col-md-4" : "d-none"
            }
          >
            {lobby.game.minPlayers > 1 && <ChatRoom />}
          </div>
        </Row>
      </div>
    </div>
  );
};

export default SalleJeu;
