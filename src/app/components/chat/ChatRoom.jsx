import {
  faFaceSmile,
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane,
  faPlay,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { baseURL } from "../../../environnements/environnement";
import { UploadVoice, readVoices } from "../../service/frontendService";
import "./../../assets/scss/chat.scss";
import ChatVideoRoom from "./ChatVideoRoom";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";

var stompClient = null;
const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState(
    JSON.parse(localStorage.getItem("info")).info.id
  );
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
    currentDate: new Date().toLocaleString(),
    message: "",
  });
  const [message, setMessage] = useState("");
  const [chatMessage, setChatMessage] = useState(true);
  const [clickButton, setClickButton] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [alreadyStart, setAlreadyStart] = useState(false);
  const [appelEntrant, setAppelEntrant] = useState(false);

  useEffect(() => {}, [userData]);

  useEffect(() => {
    registerUser();
  }, []);

  const connect = () => {
    let Sock = new SockJS(`${baseURL}/ws`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chat/lobby", onMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
    stompClient.subscribe(
      "/user/" + userData.username + "/private/video/call",
      onCallVideoReceivedPrivate
    );
    userJoin();
  };

  const onCallVideoReceivedPrivate = (payload) => {
    var payloadData = JSON.parse(payload.body);
    setAlreadyStart(payloadData.call);
    setAppelEntrant(
      payloadData.call &&
        payloadData.userConnect !=
          JSON.parse(localStorage.getItem("auth")).userid
    );
    setChatMessage(!payloadData.call);
  };
  useEffect(() => {}, [appelEntrant]);
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleEmojiClick = (emoji) => {
    const emojiRepresentation = emoji.emoji;
    setMessage((prevMessage) => prevMessage + emojiRepresentation);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevShowEmojiPicker) => !prevShowEmojiPicker);
  };

  const userJoin = () => {
    var chatMessage = {
      senderUser: userData.senderUser,
      lobby: userData.lobby,
      message: userData.message,
      senderName: userData.username,
      receiverName: userData.receivername,
      currentDate: new Date().toLocaleString(),
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);

    if (!payloadData.status) {
      const key = Object.keys(payloadData)[0];
      privateChats.set(parseInt(key, 10), payloadData[key]);
      setPrivateChats(new Map(privateChats));
    } else {
      publicChats.push(payloadData);
      setPublicChats([...new Set(publicChats)]);
    }
  };

  const onPrivateMessage = (payload) => {
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.lobby)) {
      const oldval = privateChats.get(payloadData.lobby).slice(-1)[0];
      if (oldval !== payloadData) {
        privateChats.get(payloadData.lobby).push(payloadData);
        setPrivateChats(new Map(privateChats));
      }
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.lobby, [...new Set(list)]);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    registerUser();
  };

  const sendPrivateValue = (messageVoice = "") => {
    setClickButton(true);
    if (stompClient) {
      var chatMessage = {
        senderUser: userData.senderUser,
        lobby: userData.lobby,
        message: messageVoice != "" ? messageVoice : message,
        senderName: userData.username,
        receiverName: userData.receivername,
        currentDate: new Date().toLocaleString(),
        status: "MESSAGE",
      };
      if (privateChats.has(tab) && Array.isArray(privateChats.get(tab))) {
        privateChats.get(tab).push(chatMessage);
      } else {
        privateChats.set(tab, [chatMessage]);
      }

      setPrivateChats(new Map(privateChats));

      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setMessage("");
      setUserData({ ...userData, message: "" });
      setClickButton(false);
    }
    setClickButton(false);
  };
  const registerUser = () => {
    connect();
  };

  /* Start Voice
   */
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);

  // Logic for starting and stopping the recording
  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Logic for starting the recording
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        recorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };
  const startCallVideo = () => {
    setChatMessage(!chatMessage);
    stompClient.send(
      "/app/start/callUser",
      {},
      JSON.stringify({
        call: !alreadyStart,
        lobby: JSON.parse(localStorage.getItem("info")).info.id,
        userConnect: JSON.parse(localStorage.getItem("auth")).userid,
      })
    );
    stompClient.subscribe(
      "/user/" + userData.username + "/private/video/call",
      onCallVideoReceivedPrivate
    );
    setAlreadyStart(!alreadyStart);

    if (!chatMessage) window.location.reload();
  };
  useEffect(() => {}, [alreadyStart]);
  // Logic for stopping the recording
  const stopRecording = () => {
    const mediaRecorder = recorderRef.current;
    mediaRecorder.stop();
    setIsRecording(false);

    mediaRecorder.addEventListener("dataavailable", async (e) => {
      const audioBlob = e.data;
      const formData = new FormData();
      formData.append("audio", audioBlob);

      try {
        const response = await UploadVoice(formData);
        sendPrivateValue(response);
      } catch (error) {
        console.error("Error uploading audio:", error);
      }
    });
  };
  // Play message

  const handlePlay = async (message) => {
    try {
      const response = await readVoices(message);
      const audioUrl = URL.createObjectURL(response);
      const audio = new Audio(audioUrl);
      audio.controls = true;
      audio.play();
    } catch (error) {
      console.error("Error while playing audio:", error);
    }
  };

  /* End Voice
   */
  useEffect(() => {}, [chatMessage]);
  return (
    <div className="tcha-block">
      <div className="chat-content">
        {userData.connected ? (
          <>
            <div
              className="d-flex py-2"
              style={{ justifyContent: "space-between" }}
            >
              <h2>Discussion</h2>
              <button
                onClick={() => startCallVideo()}
                style={{ border: "none" }}
              >
                <FontAwesomeIcon
                  icon={!appelEntrant && chatMessage ? faVideo : faVideoSlash}
                  style={{
                    color: "#d1a521",
                    fontSize: "2em",
                  }}
                />
              </button>
            </div>
            {chatMessage && !appelEntrant ? (
              <>
                <ul className="chat-messages">
                  {privateChats.size > 0 &&
                    privateChats.has(tab) &&
                    Array.isArray(privateChats.get(tab)) &&
                    privateChats.get(tab).map((chat, index) => (
                      <li
                        className={`message ${
                          chat.senderName === userData.username && "self"
                        }`}
                        key={index}
                      >
                        {chat.senderName !== userData.username && (
                          <div className="avatar">
                            <span>
                              {" "}
                              {chat.senderName.substring(2, 0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div
                          className={
                            chat.senderName !== userData.username
                              ? "message-data"
                              : "message-data message-data-self"
                          }
                        >
                          {chat.message.includes("_blob") ? (
                            <button
                              className="tchat-cs-btn"
                              onClick={() => handlePlay(chat.message)}
                            >
                              <FontAwesomeIcon
                                icon={faPlay}
                                style={{
                                  color:
                                    chat.senderName !== userData.username
                                      ? "#dc3545"
                                      : "blue",
                                  fontSize: "1.3em",
                                }}
                              />
                            </button>
                          ) : (
                            <span className="message-text">{chat.message}</span>
                          )}

                          <span
                            className="text-info"
                            style={{
                              fontSize: "small",
                            }}
                          >
                            <br />{" "}
                            <span className="tcha-message-time">
                              {chat.currentDate}
                            </span>
                          </span>
                        </div>
                        {chat.senderName === userData.username && (
                          <div className="avatar self">
                            <span>
                              {chat.senderName.substring(2, 0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
                <div className="send-message">
                  <div
                    className="message-box-emoji"
                    style={{
                      justifyContent: isRecording ? "center" : "space-between",
                    }}
                  >
                    {!isRecording && (
                      <div className="d-flex w-100 align-items-center">
                        <textarea
                          value={message}
                          onChange={handleInputChange}
                          placeholder="Message."
                          className="w-100 form-control"
                        />
                        <button
                          onClick={toggleEmojiPicker}
                          className="tchat-cs-btn"
                        >
                          <FontAwesomeIcon
                            icon={faFaceSmile}
                            style={{
                              color: "#d1a521",
                              fontSize: "1.3em",
                            }}
                          />
                        </button>
                      </div>
                    )}

                    {message != "" ? (
                      <button
                        type="button"
                        className="tchat-cs-btn"
                        onClick={() => sendPrivateValue()}
                        disabled={clickButton}
                      >
                        <FontAwesomeIcon
                          icon={faPaperPlane}
                          style={{
                            color: "#d1a521",
                            fontSize: "1.3em",
                          }}
                        />
                      </button>
                    ) : (
                      <button
                        onClick={handleToggleRecording}
                        className="tchat-cs-btn"
                      >
                        {isRecording ? (
                          <FontAwesomeIcon
                            icon={faMicrophoneSlash}
                            style={{
                              color: "blue",
                              fontSize: "1.3em",
                            }}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faMicrophone}
                            style={{
                              color: "#d1a521",
                              fontSize: "1.3em",
                            }}
                          />
                        )}
                      </button>
                    )}
                  </div>
                  {showEmojiPicker && (
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  )}
                </div>
              </>
            ) : (
              <ChatVideoRoom
                alreadyStart={alreadyStart}
                appelEntrant={appelEntrant}
              />
            )}
          </>
        ) : (
          <div className="register">Loading ...</div>
        )}
      </div>
    </div>
  );
};
export default ChatRoom;
