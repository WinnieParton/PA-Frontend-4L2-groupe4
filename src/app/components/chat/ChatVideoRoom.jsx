import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import { baseURL } from "../../../environnements/environnement";
import Notifications from "../video/Notifications";
import VideoPlayer from "../video/VideoPlayer";

var stompClient = null;
const ChatVideoRoom = ({ firstload, appelEntrant }) => {
  const [stream, setStream] = useState(null);
  const me = JSON.parse(localStorage.getItem("auth")).userName;
  const idToCall =
    JSON.parse(localStorage.getItem("auth")).userid !=
    JSON.parse(localStorage.getItem("info")).info.participants[0].id
      ? JSON.parse(localStorage.getItem("info")).info.participants[0]?.name
      : JSON.parse(localStorage.getItem("info")).info.participants[1]?.name;
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
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
    stompClient.subscribe(
      "/user/" + me + "/private/video/call/leave",
      leaveCallAnother
    );
    if (!appelEntrant) userJoin();
    else {
      if (appelEntrant && firstload) {
        stompClient.subscribe("/user/" + me + "/private/video", lastInfoVideo);
      }
    }
  };

  const lastInfoVideo = (payload) => {
    var payloadData = JSON.parse(payload.body);
    onMessageReceivedCall(payloadData);
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
  const onMessageReceivedCall = (payloadData) => {
    setCall({
      isReceivingCall: true,
      from: payloadData.from,
      name: payloadData.name,
      userToCall: idToCall,
      signal: payloadData.signalData,
      lobby: JSON.parse(localStorage.getItem("info")).info.id,
    });
  };

  const answerCall = () => {
    console.log("123456789 answerCall answerCall answerCall answerCall ", call);
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
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
          name: me,
          lobby: JSON.parse(localStorage.getItem("info")).info.id,
        })
      );
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    stompClient.subscribe(
      "/user/" + me + "/private/video/accepted",
      (payload) => {
        var payloadData = JSON.parse(payload.body);
        console.log(
          "123456789 callAccepted callAccepted callAccepted ",
          payloadData
        );
        setCallAccepted(true);
        peer.signal(payloadData.signalData);
      }
    );
    connectionRef.current = peer;
  };

  const leaveCallAnother = () => {
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
        name={me}
        callAccepted={callAccepted}
        myVideo={myVideo}
        userVideo={userVideo}
        callEnded={callEnded}
        stream={stream}
        idToCall={idToCall}
      />
      {appelEntrant && (
        <Notifications
          call={call}
          answerCall={answerCall}
          callAccepted={callAccepted}
        />
      )}
    </div>
  );
};
export default ChatVideoRoom;
