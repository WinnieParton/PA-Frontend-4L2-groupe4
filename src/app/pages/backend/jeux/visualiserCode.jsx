import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import appRoutes from "../../../routes/routes";
import { getGame } from "../../../service/frontendService";


const VisualiserCode = () => {
    const {id} = useParams();
    const [game, setGame] = useState({});
    
    const handleLoadGame = async () => {
        const results = await getGame(id);
        setGame(results);
        console.log(results)
    };
  
    useEffect(() => {
        handleLoadGame();
    }, []);
    return (
        <div className="container mt-5 pt-2">
            <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
                <div>
                    <h2>Liste des jeux</h2>
                </div>
                <div>
                
                    <Button variant="primary" href={appRoutes.JEUX}>
                        Retour
                    </Button>
                </div>
            </div>
            <div className="p-2 bg-light">
          <SyntaxHighlighter language={game?.language?.toLowerCase()} showLineNumbers style={vscDarkPlus}>
                       {game?.fileContent}
            </SyntaxHighlighter> 
            </div>
        </div>
    );
}

export default VisualiserCode
