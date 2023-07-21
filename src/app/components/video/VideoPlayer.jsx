import React from 'react';

const VideoPlayer = ({
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
}) => {
    const classes = {
        video: {
            maxWidth:"100%"
        },
        gridContainer: {
            justifyContent: 'center',
        },
        paper: {
            padding: '10px',
            border: '2px solid black',
            margin: '10px',
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
                        <h5>{call.name}</h5>
                        <video
                            playsInline
                            ref={userVideo}
                            autoPlay
                            style={classes.video}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
