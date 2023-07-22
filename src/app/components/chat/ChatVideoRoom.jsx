import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import { baseURL } from "../../../environnements/environnement";
import Notifications from "../video/Notifications";
import Options from "../video/Options";
import VideoPlayer from "../video/VideoPlayer";

var stompClient = null;
var peer = null;
const ChatVideoRoom = ({ alreadyStart, appelEntrant }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState(
    JSON.parse(localStorage.getItem("auth")).userName
  );
  const [idToCall, setIdToCall] = useState(
    JSON.parse(localStorage.getItem("auth")).userid !=
      JSON.parse(localStorage.getItem("info")).info.participants[0].id
      ? JSON.parse(localStorage.getItem("info")).info.participants[0]?.name
      : JSON.parse(localStorage.getItem("info")).info.participants[1]?.name
  );
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState(
    JSON.parse(localStorage.getItem("auth")).userName
  );
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
    if (!appelEntrant) userJoin();
    else {
      stompClient.send(
        "/app/data/callUser",
        {},
        JSON.stringify({
          userToCall: idToCall,
          signalData: '',
          from: me,
          name,
          lobby: JSON.parse(localStorage.getItem("info")).info.id,
        })
      );

      stompClient.subscribe("/chat/data/callUser", onMessageReceivedCall);
    }
  };
  const registerUser = () => {
    connect();
  };
  const onError = (err) => {
    registerUser();
  };
  const userJoin = () => {
    callUser(idToCall);
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
      lobby: JSON.parse(localStorage.getItem("info")).info.id,
    });
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      console.log("sssssssssssssssssssssssssssssssssssssssss  ", data);
      stompClient.send(
        "/app/answerCall",
        {},
        JSON.stringify({ signalData: data, from: call.from })
      );
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      stompClient.send(
        "/app/callUser",
        {},
        JSON.stringify({
          userToCall: id,
          signalData: data,
          from: me,
          name,
          lobby: JSON.parse(localStorage.getItem("info")).info.id,
        })
      );
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    stompClient.subscribe("/chat/callAccepted", onMessageReceivedCallAccepted);
  };

  const onMessageReceivedCallAccepted = (payload) => {
    var payloadData = JSON.parse(payload.body);
    console.log("ddddddddddddd  onMessageReceivedCallAccepted", payloadData);

    setCallAccepted(true);
    peer.signal(payloadData.signalData);
    connectionRef.current = peer;
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
      {appelEntrant && (
        <Options
          callAccepted={callAccepted}
          callEnded={callEnded}
          leaveCall={leaveCall}
        >
          <Notifications
            call={call}
            answerCall={answerCall}
            callAccepted={callAccepted}
          />
        </Options>
      )}
    </div>
  );
};
export default ChatVideoRoom;
