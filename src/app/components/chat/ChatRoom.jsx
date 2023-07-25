import {
  faFaceSmile,
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane,
  faPhoneSlash,
  faPlay,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import { baseURL } from "../../../environnements/environnement";
import { UploadVoice, readVoices } from "../../service/frontendService";
import "./../../assets/scss/chat.scss";
import ChatVideoRoom from "./ChatVideoRoom";

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
  const [firstload, setFirstload] = useState(true);
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [stream, setStream] = useState(null);
  const myVideo = useRef(null);
  const connectionRef = useRef();
  const idToCall =
    JSON.parse(localStorage.getItem("auth")).userid !=
    JSON.parse(localStorage.getItem("info")).info.participants[0].id
      ? JSON.parse(localStorage.getItem("info")).info.participants[0]?.name
      : JSON.parse(localStorage.getItem("info")).info.participants[1]?.name;
  const me = JSON.parse(localStorage.getItem("auth")).userName;
  useEffect(() => {}, [userData]);
  useEffect(() => {}, [call]);

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
    stompClient.subscribe(
      "/user/" +
        JSON.parse(localStorage.getItem("auth")).userName +
        "/private/video/call/leave",
      leaveCallAnother
    );
    userJoin();
  };
  const leaveCallAnother = () => {
    window.location.reload();
  };
  const onCallVideoReceivedPrivate = (payload) => {
    var payloadData = JSON.parse(payload.body);
    setAlreadyStart(payloadData.call);
    setAppelEntrant(
      payloadData.call &&
        payloadData.userConnect !=
          JSON.parse(localStorage.getItem("auth")).userid
    );

    setFirstload(nb % 2 === 0);
    setChatMessage(!payloadData.call);
    nb += 1;
  };
  useEffect(() => {}, [appelEntrant, firstload]);
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
    if (!chatMessage == true) {
      nb = 0;
      stompClient.send(
        "/app/end/callUser",
        {},
        JSON.stringify({
          call: false,
          lobby: JSON.parse(localStorage.getItem("info")).info.id,
          userConnect: JSON.parse(localStorage.getItem("auth")).userid,
        })
      );
    }
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
  let nb = 0;

  const answerCall = () => {
    if (nb == 0) {
      setCallAccepted(true);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.once("signal", (data) => {
        if (data.type.includes("answer")) {
          setCall((prevCall) => ({
            ...prevCall,
            signal: data,
          }));
          stompClient.send(
            "/app/answerCall",
            {},
            JSON.stringify({
              signalData: data,
              from: call.from,
              name: call.name,
              userToCall: idToCall,
              lobby: JSON.parse(localStorage.getItem("info")).info.id,
            })
          );
        }
      });

      peer.signal(call.signal);
      connectionRef.current = peer;
    }
    nb += 1;
  };

  const getUserMedia = async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      stompClient.send(
        "/app/callUser",
        {},
        JSON.stringify({
          userToCall: id,
          signalData: data,
          from: me,
          name: me,
          lobby: JSON.parse(localStorage.getItem("info")).info.id,
        })
      );
    });
    stompClient.subscribe(
      "/user/" + me + "/private/video/accepted",
      (payload) => {
        var payloadData = JSON.parse(payload.body);

        setCallAccepted(true);
        peer.signal(payloadData.signalData);
      }
    );
    connectionRef.current = peer;
  };
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
                  icon={!appelEntrant && chatMessage ? faVideo : faPhoneSlash}
                  style={{
                    color: !appelEntrant && chatMessage ? "#d1a521" : "red",
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
                firstload={firstload}
                appelEntrant={appelEntrant}
                answerCall={answerCall}
                call={call}
                setCall={setCall}
                setCallAccepted={setCallAccepted}
                callAccepted={callAccepted}
                getUserMedia={getUserMedia}
                stream={stream}
                myVideo={myVideo}
                connectionRef={connectionRef}
                idToCall={idToCall}
                callUser={callUser}
                me={me}
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
