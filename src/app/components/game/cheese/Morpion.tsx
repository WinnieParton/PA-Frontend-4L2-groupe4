import { useState } from 'react';

const Morpion = () => {
    const gameData = {
        displays: [
            {
                width: '300',
                height: '300',
                content: [
                    {
                        tag: 'style',
                        content: 'line{stroke:black;stroke-width:4;}',
                    },
                    {
                        tag: 'line',
                        x1: '0',
                        y1: '100',
                        x2: '300',
                        y2: '100',
                    },
                    {
                        tag: 'line',
                        x1: '100',
                        y1: '0',
                        x2: '100',
                        y2: '300',
                    },
                    {
                        tag: 'line',
                        x1: '0',
                        y1: '200',
                        x2: '300',
                        y2: '200',
                    },
                    {
                        tag: 'line',
                        x1: '200',
                        y1: '0',
                        x2: '200',
                        y2: '300',
                    },
                    {
                        tag: 'circle',
                        cx: '150',
                        cy: '50',
                        r: '33',
                        fill: 'blue',
                    },
                    {
                        tag: 'circle',
                        cx: '150',
                        cy: '250',
                        r: '33',
                        fill: 'blue',
                    },
                    {
                        tag: 'circle',
                        cx: '250',
                        cy: '50',
                        r: '33',
                        fill: 'red',
                    },
                ],
                player: 1,
            },
            {
                width: '300',
                height: '300',
                content: [
                    {
                        tag: 'style',
                        content: 'line{stroke:black;stroke-width:4;}',
                    },
                    {
                        tag: 'line',
                        x1: '0',
                        y1: '100',
                        x2: '300',
                        y2: '100',
                    },
                    {
                        tag: 'line',
                        x1: '100',
                        y1: '0',
                        x2: '100',
                        y2: '300',
                    },
                    {
                        tag: 'line',
                        x1: '0',
                        y1: '200',
                        x2: '300',
                        y2: '200',
                    },
                    {
                        tag: 'line',
                        x1: '200',
                        y1: '0',
                        x2: '200',
                        y2: '300',
                    },
                    {
                        tag: 'circle',
                        cx: '150',
                        cy: '50',
                        r: '33',
                        fill: 'blue',
                    },
                    {
                        tag: 'circle',
                        cx: '150',
                        cy: '250',
                        r: '33',
                        fill: 'blue',
                    },
                    {
                        tag: 'circle',
                        cx: '250',
                        cy: '50',
                        r: '33',
                        fill: 'red',
                    },
                ],
                player: 2,
            },
        ],
        requested_actions: [
            {
                type: 'CLICK',
                player: 2,
                zones: [
                    {
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 100,
                    },
                    {
                        x: 0,
                        y: 100,
                        width: 100,
                        height: 100,
                    },
                    {
                        x: 0,
                        y: 200,
                        width: 100,
                        height: 100,
                    },
                    {
                        x: 100,
                        y: 100,
                        width: 100,
                        height: 100,
                    },
                    {
                        x: 200,
                        y: 100,
                        width: 100,
                        height: 100,
                    },
                    {
                        x: 200,
                        y: 200,
                        width: 100,
                        height: 100,
                    },
                ],
            },
        ],
        game_state: {
            scores: [0, 0],
            game_over: false,
        },
    };
    const [scores, setScores] = useState(gameData.game_state.scores);

    const handleZoneClick = (zone, zoneIndex) => {
        // Handle the click event here based on the zoneIndex
        // You can update the game state, scores, etc.
        // For this example, we'll just increment the score of player 1
        console.log('Clicked zone:', zoneIndex);
        console.log('Clicked zone:', zone);

        console.log('prevScores:', scores);
    };

    return (
        <div>
            <div>
                <svg
                    width={gameData.displays[0].width}
                    height={gameData.displays[0].height}
                >
                    {gameData.displays
                        .flatMap((display) => display.content)
                        .map((item, itemIndex) => {
                            if (item.tag === 'style') {
                                return (
                                    <style key={itemIndex}>
                                        {item.content}
                                    </style>
                                );
                            } else if (item.tag === 'line') {
                                return (
                                    <line
                                        key={itemIndex}
                                        x1={item.x1}
                                        y1={item.y1}
                                        x2={item.x2}
                                        y2={item.y2}
                                    />
                                );
                            } else if (item.tag === 'circle') {
                                return (
                                    <circle
                                        key={itemIndex}
                                        cx={item.cx}
                                        cy={item.cy}
                                        r={item.r}
                                        fill={item.fill}
                                    />
                                );
                            }
                            return null;
                        })}
                </svg>
                <p>Player: {gameData.displays[0].player}</p>
            </div>
            {gameData.requested_actions.map((action, index) => (
                <div key={index}>
                    <p>Type: {action.type}</p>
                    <p>Player: {action.player}</p>
                    {action.zones.map((zone, zoneIndex) => (
                        <div
                            key={zoneIndex}
                            style={{
                                position: 'absolute',
                                top: zone.y,
                                left: zone.x,
                                width: zone.width,
                                height: zone.height,
                            }}
                            onClick={() => handleZoneClick(zone, zoneIndex)}
                        ></div>
                    ))}
                </div>
            ))}
            <div>
                <p>Scores:</p>
                <p>Player 1: {gameData.game_state.scores[0]}</p>
                <p>Player 2: {gameData.game_state.scores[1]}</p>
                {gameData.game_state.game_over && <p>Game Over!</p>}
            </div>
        </div>
    );
};
export default Morpion;
