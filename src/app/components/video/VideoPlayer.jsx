import React, { useEffect, useRef } from "react";

const VideoPlayer = ({
  name,
  callAccepted,
  myVideo,
  callEnded,
  stream,
  idToCall,
}) => {
  const userVideo = useRef(null);
  const getUserMedia = async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserMedia();
  }, [callAccepted]);
  const classes = {
    video: {
      maxWidth: "100%",
    },
    gridContainer: {
      justifyContent: "center",
    },
    paper: {
      padding: "10px",
      border: "2px solid black",
      margin: "10px",
    },
  };

  return (
    <div className="d-flex" style={classes.gridContainer}>
      {stream && (
        <div style={classes.paper}>
          <div className="d-grid">
            <h5>{name}</h5>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={classes.video}
            />
          </div>
        </div>
      )}
      {callAccepted && !callEnded && (
        <div style={classes.paper}>
          <div className="d-grid">
            <h5>{idToCall}</h5>
            <video playsInline ref={userVideo} autoPlay style={classes.video} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
