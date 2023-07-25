import React, { useEffect, useRef, useState} from 'react';
import {
    Button,
    ButtonGroup,
    Col,
    Form,
    Modal,
    Row,
    Tab,
    Table,
    Tabs,
    Offcanvas
} from 'react-bootstrap';
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import { baseURL } from "../../../../environnements/environnement";
import {
    AddFriend,
    AnswerInvitation,
    ListInvitationReceived,
    ListInvitationSend,
    ListMyFriends,
    researchUser,
    UploadVoice, readVoices
} from '../../../service/frontendService';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFaceSmile,
    faMicrophone,
    faMicrophoneSlash,
    faPaperPlane,
    faPlay,
  } from "@fortawesome/free-solid-svg-icons";
  import EmojiPicker from "emoji-picker-react";
  var stompClient = null;
const ListesAmis = () => {
  
    const tokenString = localStorage.getItem('auth');
    const userToken = JSON.parse(tokenString);
    const user = userToken?.token;

    const [show, setShow] = useState(false);
    const [username, setUsername] = useState(null);
    const [friendIdChat, setFriendIdChat] = useState(null);
    const [friends, setFriends] = useState([]);
    const [myFriends, setMyFriends] = useState([]);

    const [senders, setSenders] = useState([]);
    const [receivers, setReceivers] = useState([]);

    const [key, setKey] = useState("0");

    const [showOffCanvas, setShowOffCanvas] = useState(false);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [chatMessage, setChatMessage] = useState(true);
    const [userData, setUserData] = useState({
        username: JSON.parse(localStorage.getItem("auth")).userName,
        receivername:
          JSON.parse(localStorage.getItem("auth")).userid !=
          JSON.parse(localStorage.getItem("info")).info.participants[0].id
            ? JSON.parse(localStorage.getItem("info")).info.participants[0]?.name
            : JSON.parse(localStorage.getItem("info")).info.participants[1]?.name,
          receiverUser:
          JSON.parse(localStorage.getItem("auth")).userid !=
          JSON.parse(localStorage.getItem("info")).info.participants[0].id
            ? JSON.parse(localStorage.getItem("info")).info.participants[0]?.id
            : JSON.parse(localStorage.getItem("info")).info.participants[1]?.id,
        senderUser: JSON.parse(localStorage.getItem("auth")).userid,
        connected: false,
        currentDate: new Date().toLocaleString(),
        message: "",
      });
      const [isRecording, setIsRecording] = useState(false);
      const recorderRef = useRef(null);
      const [message, setMessage] = useState("");
      const [showEmojiPicker, setShowEmojiPicker] = useState(false);
      const [clickButton, setClickButton] = useState(false);
      const [tab, setTab] = useState(
        JSON.parse(localStorage.getItem("info")).info.id
      );

  const handleCloseOffCanvas = () => setShowOffCanvas(false);
  const handleShowOffCanvas = (id) => {
    setFriendIdChat(id);
    registerUser();
    setShowOffCanvas(true);
  };

    useEffect(() => {
        handleLoadMyFriend();
    }, []);
    const functGet = (k) => {
        if (k == "2") handleLoadReceiver();
        if (k == "1") handleLoadSender();
        else handleLoadMyFriend();
    };
    const handleClose = () => {
        functGet(key);
        setShow(false);
    };
    const handleShow = () => {
        setFriends([]);
        setShow(true);
    };

    const handleSearch = async () => {
        const result = await researchUser(user.id, username);
        setFriends(result);
    };

    const handleAddFriend = async (friendId) => {
        AddFriend(friendId, {
            sender: user.id ,
        });
        setFriends([]);
        setUsername(null);
        handleClose();
        handleLoadSender();
        setKey("0")
    };
    const handleLoadSender = async () => {
        const result = await ListInvitationSend(user.id);
        setSenders(result.requests);
    };
    const handleLoadMyFriend = async () => {
        const result = await ListMyFriends(user.id);
        setMyFriends(result.requests);
    };
    const handleLoadReceiver = async () => {     
        const result = await ListInvitationReceived(user.id);
        setReceivers(result.requests);
    };

    const handleValidate = async (statut, id) => {
        const result = await AnswerInvitation(user.id, {
            sender: id,
            status: statut,
        });
        window.location.reload();
    };
    const handleInputChange = (e) => {
        setMessage(e.target.value);
      };
      const toggleEmojiPicker = () => {
        setShowEmojiPicker((prevShowEmojiPicker) => !prevShowEmojiPicker);
      };
      const handleToggleRecording = () => {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      };

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
      const handleEmojiClick = (emoji) => {
        const emojiRepresentation = emoji.emoji;
        setMessage((prevMessage) => prevMessage + emojiRepresentation);
      };
      const sendPrivateValue = (messageVoice = "") => {
        setClickButton(true);
        if (stompClient) {
          var chatMessage = {
            senderUser: userData.senderUser,
            message: messageVoice != "" ? messageVoice : message,
            senderName: userData.username,
            receiverName: userData.receivername,
            receiverUser: userData.receiverUser,
            currentDate: new Date().toLocaleString(),
            status: "UNREAD",
            send : true
          };
          if (privateChats.has(tab) && Array.isArray(privateChats.get(tab))) {
            privateChats.get(tab).push(chatMessage);
          } else {
            privateChats.set(tab, [chatMessage]);
          }
    
          setPrivateChats(new Map(privateChats));
    
          stompClient.send("/app/private-message-friend", {}, JSON.stringify(chatMessage));
          setMessage("");
          setUserData({ ...userData, message: "" });
          setClickButton(false);
        }
        setClickButton(false);
      };
      const onPrivateMessage = (payload) => {
     
        var payloadData = JSON.parse(payload.body);
        console.log("payloadData -- ", payloadData);
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
    /*   useEffect(() => {
        console.log(userData);
        registerUser();
      }, []); */
      const registerUser = () => {
        connect();
      };
      const onError = (err) => {
        registerUser();
      };
      const userJoin = () => {
        var chatMessage = {
          senderUser: userData.senderUser,
          message: userData.message,
          senderName: userData.username,
          receiverName: userData.receivername,
          receiverUser: userData.receiverUser,
          currentDate: new Date().toLocaleString(),
          status: "UNREAD",
        };
        stompClient.send("/app/message-friend", {}, JSON.stringify(chatMessage));
      };
    
      const onMessageReceived = (payload) => {
        console.log(payload)
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

      const connect = () => {
        let Sock = new SockJS(`${baseURL}/ws`);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
      };
    
      const onConnected = () => {
        setUserData({ ...userData, connected: true });
        stompClient.subscribe("/user/private-chat-message", onMessageReceived);
        stompClient.subscribe(
          "/user/" + userData.senderUser + "/private/message-friend" ,
          onPrivateMessage
        );
      
    
       console.log("stompClient -- ",stompClient)
        userJoin();
      };

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
  
    return (
        <div className="container mt-5 pt-2">
            <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
                <div>
                    <h2>Listes des amis</h2>
                </div>
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        Ajouter un ami
                    </Button>
                </div>
            </div>
            <Tabs
                activeKey={key}
                onSelect={(k) => {
                    setKey(k);
                    functGet(k);
                }}
                className="my-3"
            >
                <Tab eventKey="0" title="Mes amis">
                    <Table bordered hover>
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Nom d'utilisateur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myFriends.length > 0 ? (
                                myFriends.map(
                                    (el, index) =>(
                                     
                                            <tr key={index}>
                                                <td>{el.user.name} ({el.user.email})</td>
                                                <td>
                                                    <Button variant="primary" onClick={() => handleShowOffCanvas(el.user.id)}>
                                                        Envoyez un message
                                                    </Button> 
                                                </td>
                                            </tr>
                                        )
                                )
                            ) : (
                               
                                  <tr>
                                  <td>
                                  <span className="text-primary text-center mt-4">
                                  Aucun ami
                                    </span>
                                  </td>
                                  </tr>
                            )}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="1" title="Demande envoyer">
                    <Table bordered hover>
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Nom d'utilisateur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {senders.length > 0 ? (
                                senders.map(
                                    (el, index) =>
                                        el.friend.id !== el.user && (
                                            <tr key={index}>
                                                <td>{el.friend.name}</td>
                                                <td>
                                                    <Button variant="outline-danger">
                                                        Annuler
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                )
                            ) : (
                               
                                 <tr>
                                 <td>
                                 <span className="text-primary text-center mt-4">
                                 Aucune invitation envoyé
                                   </span>
                                 </td>
                                 </tr>
                            )}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="2" title="Demande en attente">
                    <Table bordered hover>
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Nom d'utilisateur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receivers.length > 0 ? (
                                receivers.map(
                                    (el, index) =>
                                        el.user.id !== el.friend && (
                                            <tr key={index}>
                                                <td>{el.user.name}</td>
                                                <td>
                                                    <ButtonGroup>
                                                        <Button
                                                            variant="outline-success"
                                                            onClick={() =>
                                                                handleValidate(
                                                                    'ACCEPTED',
                                                                    el.user.id
                                                                )
                                                            }
                                                        >
                                                            Accepter
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() =>
                                                                handleValidate(
                                                                    'REJECTED',
                                                                    el.user.id
                                                                )
                                                            }
                                                        >
                                                            Rejeter
                                                        </Button>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>
                                        )
                                )
                            ) : (
                              
                                   <tr>
                                   <td>
                                   <span className="text-primary text-center mt-4">
                                   Aucune invitation recu
                                     </span>
                                   </td>
                                   </tr>
                            )}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un ami</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Control
                                type="text"
                                placeholder="Nom d'utilisateur"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Button
                                variant="primary"
                                className="mt-2"
                                onClick={handleSearch}
                            >
                                Recherche
                            </Button>
                        </Form.Group>
                    </Form>
                    {friends.length > 0 ? (
                        friends.map(
                            (friend, index) =>
                                friend.id !== friend.user && (
                                    <Row
                                        className="p-2 my-2 bg-light align-items-center"
                                        key={index}
                                    >
                                        <Col md="8" sm="6">
                                            <h3>{friend.name}</h3>
                                        </Col>
                                        <Col md="4" sm="6">
                                            <Button
                                                variant="info"
                                                onClick={() =>
                                                    handleAddFriend(friend.id)
                                                }
                                            >
                                                Invitation
                                            </Button>
                                        </Col>
                                    </Row>
                                )
                        )
                    ) : (
                      <tr>
                      <td>
                      <span className="text-primary text-center mt-4">
                            Aucun ami trouvé
                        </span>
                      </td>
                      </tr>
                    )}
                </Modal.Body>
            </Modal>



        <Offcanvas show={showOffCanvas} onHide={handleCloseOffCanvas} placement="end" name="end">
            <Offcanvas.Header closeButton>
            <Offcanvas.Title>Discussion</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
            <div className="chat-content">
       
            {chatMessage ? (
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
                <div className="register">Loading ...</div>
                )}
      </div>
            </Offcanvas.Body>
        </Offcanvas>

        </div>
    );
};

export default ListesAmis;
