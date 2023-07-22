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
  callAccepted,
  callEnded,
  leaveCall,
}) => {
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
          <div className="d-grid" style={classes.padding}>
            {callAccepted && !callEnded && (
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
            )}
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Options;
