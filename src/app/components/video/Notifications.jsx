import React from "react";

const Notifications = ({ call, answerCall, callAccepted }) => {
  const classes = {
    container: {
      maxWidth: "100%",
      margin: "35px 0",
      padding: 0,
    },
    paper: {
      padding: "10px 20px",
      border: "2px solid black",
      boxShadow: "0 8px 8px -4px lightblue",
    },
  };
  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div className="container" style={classes.container}>
          <div style={classes.paper}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h1>{call.name} is calling: </h1>
              <button className="primary" onClick={answerCall}>
                Answer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;
