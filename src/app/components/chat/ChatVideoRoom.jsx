import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import Notifications from "../video/Notifications";
import Options from "../video/Options";
import VideoPlayer from "../video/VideoPlayer";
import { baseURL } from "../../../environnements/environnement";

var stompClient = null;
const ChatVideoRoom = () => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState(
    JSON.parse(localStorage.getItem("auth")).userid !=
      JSON.parse(localStorage.getItem("info")).info.participants[0].id
      ? JSON.parse(localStorage.getItem("info")).info.participants[0]?.id
      : JSON.parse(localStorage.getItem("info")).info.participants[1]?.id
  );
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef(null);
  const userVideo = useRef();
  const connectionRef = useRef();
  useEffect(() => {
    connect();
  }, []);

  const connect = () => {
    let Sock = new SockJS(`${baseURL}/ws`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };
  const onConnected = () => {
    getUserMedia();
    stompClient.subscribe("/chat/callUser", onMessageReceivedCall);
    stompClient.subscribe(
      "/user/" + JSON.parse(localStorage.getItem("auth")).userName + "/private/video",
      onPrivateMessage
    );
    userJoin();
  };
  const registerUser = () => {
    connect();
  };
  const onError = (err) => {
    registerUser();
  };
  const userJoin = () => {
    var chatMessage = {
      userToCall:
        JSON.parse(localStorage.getItem("auth")).userid !=
        JSON.parse(localStorage.getItem("info")).info.participants[0].id
          ? JSON.parse(localStorage.getItem("info")).info.participants[0]?.name
          : JSON.parse(localStorage.getItem("info")).info.participants[1]?.name,
      signalData: "",
      from: JSON.parse(localStorage.getItem("auth")).userName,
      name: JSON.parse(localStorage.getItem("auth")).userName,
    };
    stompClient.send("/app/callUser", {}, JSON.stringify(chatMessage));
  };
  const getUserMedia = async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(currentStream);
      myVideo.current.srcObject = currentStream;
    } catch (error) {
      console.log(error);
    }
  };
  const onMessageReceivedCall = (payload) => {
    var payloadData =
      payload.body != "" ? JSON.parse(payload.body) : payload.body;
    console.log("ddddddddddddd  onMessageReceivedCall", payloadData);
    setCall({
      isReceivingCall: true,
      from: payloadData.from,
      name: payloadData.name,
      signal: payloadData.signalData,
    });
  };

  const onPrivateMessage = (payload) => {
    var payloadData = JSON.parse(payload.body);
    console.log("ddddddddddddd  onPrivateMessage", payloadData);
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      stompClient.send(
        "/app/answerCall",
        {},
        JSON.stringify({ signal: data, to: call.from })
      );
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
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
          name,
        })
      );
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    stompClient.subscribe("/chat/callAccepted", onMessageReceivedCallAccepted);

    connectionRef.current = peer;
  };
  const onMessageReceivedCallAccepted = (payload) => {
    var payloadData = JSON.parse(payload.body);
    console.log("ddddddddddddd  onMessageReceivedCallAccepted", payloadData);

    setCallAccepted(true);
    peer.signal(payloadData.signalData);
  };
  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <VideoPlayer
        name={name}
        callAccepted={callAccepted}
        myVideo={myVideo}
        userVideo={userVideo}
        callEnded={callEnded}
        stream={stream}
        call={call}
      />
      <Options
        me={me}
        callAccepted={callAccepted}
        name={name}
        callEnded={callEnded}
        leaveCall={leaveCall}
        callUser={callUser}
        setName={setName}
      >
        <Notifications
          call={call}
          answerCall={answerCall}
          callAccepted={callAccepted}
        />
      </Options>
    </div>
  );
};
export default ChatVideoRoom;
