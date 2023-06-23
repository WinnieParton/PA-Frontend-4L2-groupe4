import React, { useEffect, useState } from 'react';
import TicTacToe from "./components/TicTacToe";
const Morpion = () => {
  const [data, setData] = useState({});
  const handleStartGame = () => {
    const lobby: {
        id?: any;
        name?: string;
        game?: {
            miniature?: string;
            name?: string;
            maxPlayers?: number;
            minPlayers?: string;
            id?: number;
        };
        status?: string;
        creator?: any;
        participants?: any;
    } = JSON.parse(localStorage.getItem('info')).info;

    const value: {
        player1: string;
        player2: string;
    } = {
        player1: lobby.creator.name,
        player2:
            lobby.creator.name !== lobby.participants[0].name
                ? lobby.participants[0].name
                : lobby.participants[1].name
    };

setData(value)

   
};


useEffect(() => {
  handleStartGame();
}, []);

  const gameData = {
    "displays": [
      {
        "width": "300",
        "height": "300",
        "content": [
          {
            "tag": "style",
            "content": "line{stroke:black;stroke-width:4;}"
          },
          {
            "tag": "line",
            "x1": "0",
            "y1": "100",
            "x2": "300",
            "y2": "100"
          },
          {
            "tag": "line",
            "x1": "100",
            "y1": "0",
            "x2": "100",
            "y2": "300"
          },
          {
            "tag": "line",
            "x1": "0",
            "y1": "200",
            "x2": "300",
            "y2": "200"
          },
          {
            "tag": "line",
            "x1": "200",
            "y1": "0",
            "x2": "200",
            "y2": "300"
          }
        ],
        "player": 1
      }
    ],
    "requested_actions": [
      {
        "type": "CLICK",
        "player": 1,
        "zones": [
          {
            "x": 0,
            "y": 0,
            "width": 100,
            "height": 100
          },
          {
            "x": 0,
            "y": 100,
            "width": 100,
            "height": 100
          },
          {
            "x": 0,
            "y": 200,
            "width": 100,
            "height": 100
          },
          {
            "x": 100,
            "y": 0,
            "width": 100,
            "height": 100
          },
          {
            "x": 100,
            "y": 100,
            "width": 100,
            "height": 100
          },
          {
            "x": 100,
            "y": 200,
            "width": 100,
            "height": 100
          },
          {
            "x": 200,
            "y": 0,
            "width": 100,
            "height": 100
          },
          {
            "x": 200,
            "y": 100,
            "width": 100,
            "height": 100
          },
          {
            "x": 200,
            "y": 200,
            "width": 100,
            "height": 100
          }
        ]
      }
    ],
    "game_state": {
      "scores": [
        0,
        0
      ],
      "game_over": false
    }
  };
  return ( <div className="app">
 
    <TicTacToe gameData={gameData} participants={{ "player1" : data.player1, "player2" :data.player2 }}/>
  </div>)
}

export default Morpion;
