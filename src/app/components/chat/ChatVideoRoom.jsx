import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import { baseURL } from "../../../environnements/environnement";
import Notifications from "../video/Notifications";
import VideoPlayer from "../video/VideoPlayer";

var stompClient = null;
const ChatVideoRoom = ({
  firstload,
  appelEntrant,
  call,
  answerCall,
  setCall,
  setCallAccepted,
  callAccepted,
  getUserMedia,
  stream,
  myVideo,
  connectionRef,
  idToCall,
  callUser,
  me
}) => {
  const [callEnded, setCallEnded] = useState(false);
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
