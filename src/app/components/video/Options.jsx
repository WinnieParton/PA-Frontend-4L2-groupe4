import {
  faCopy,
  faPhone,
  faPhoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Options = ({
  children,
  me,
  callAccepted,
  name,
  callEnded,
  leaveCall,
  callUser,
  setName,
}) => {
  const [idToCall, setIdToCall] = useState("");
  const classes = {
    root: {
      display: "flex",
      flexDirection: "column",
    },
    gridContainer: {
      width: "100%",
    },
    container: {
      maxWidth: "100%",
      margin: "35px 0",
      padding: 0,
    },
    margin: {
      marginTop: 20,
    },
    padding: {
      padding: 20,
    },
    paper: {
      padding: "10px 20px",
      border: "2px solid black",
      boxShadow: "0 8px 8px -4px lightblue",
    },
  };

  return (
    <div className="container" style={classes.container}>
      <div style={classes.paper}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          noValidate
          autoComplete="off"
        >
          <div className="container" style={classes.gridContainer}>
            <div className="d-grid" style={classes.padding}>
              <h2>Account Info</h2>
              <input value={name} onChange={(e) => setName(e.target.value)} />

              <CopyToClipboard text={me} className={classes.margin}>
                <span>
                  <FontAwesomeIcon
                    icon={faCopy}
                    style={{
                      color: "#d1a521",
                      fontSize: "2em",
                    }}
                  />
                  Copy Your ID
                </span>
              </CopyToClipboard>
            </div>
            <div className="d-grid" style={classes.padding}>
              <h6>Make A Call</h6>
              <label>ID To Call</label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={(e) => setIdToCall(e.target.value)}
              />
              {callAccepted && !callEnded ? (
                <span
                  className="secondary"
                  onClick={leaveCall}
                  style={classes.margin}
                >
                  <FontAwesomeIcon
                    icon={faPhoneSlash}
                    style={{
                      color: "red",
                      fontSize: "2em",
                    }}
                  />
                  Leave Call
                </span>
              ) : (
                <span
                  className="primary"
                  onClick={() => callUser(idToCall)}
                  style={classes.margin}
                >
                  <FontAwesomeIcon
                    icon={faPhone}
                    style={{
                      color: "red",
                      fontSize: "2em",
                    }}
                  />
                  Call
                </span>
              )}
            </div>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Options;
