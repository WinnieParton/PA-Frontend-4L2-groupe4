import React, { useState, useRef, useEffect } from "react";
import Peer from "simple-peer";
import Notifications from "../video/Notifications";
import Options from "../video/Options";
import VideoPlayer from "../video/VideoPlayer";
import { io } from "socket.io-client";
const ChatVideoRoom = () => {
  const socket = io("http://localhost:5000/");

  const [stream, setStream] = useState(null);
  const [me, setMe] = useState(JSON.parse(localStorage.getItem("auth")).userid !=
  JSON.parse(localStorage.getItem("info")).info.participants[0].id
    ? JSON.parse(localStorage.getItem("info")).info.participants[0]?.id
    : JSON.parse(localStorage.getItem("info")).info.participants[1]?.id);
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('')
  const myVideo = useRef(null);
  const userVideo = useRef();
  const connectionRef = useRef();
  useEffect(() => {
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
    getUserMedia();
    socket.on("me", (id) => setMe(id));
    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
    console.log("ddddddddddddddddddd  ",me);
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
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
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
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
