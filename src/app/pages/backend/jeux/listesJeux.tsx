import { useEffect, useState } from "react";
import appRoutes from "../../../routes/routes";
import { Button, Card } from "react-bootstrap";
import { ListGames } from "../../../service/frontendService";

const ListesJeux = () =>{
    const [games, setGames] = useState([]);
    const list = async () => {
        const result = await ListGames();
        setGames(result.games);
    };
    useEffect(() => {
        list();
        console.log(games);
        
    }, []);
  
    return (
        <div className="container mt-5 pt-2">
            <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
                <div>
                    <h2>Liste des jeux</h2>
                </div>
                <div>
                
                    <Button variant="primary" href={appRoutes.JEUX_AJOUTER}>
                        Ajouter un jeu
                    </Button>
                </div>
            </div>

            <div className="cs-grid p-2 bg-light">
            {games.length > 0 ? (
                    games.map((el, index) => (
                        <Card key={index}>
                            <Card.Img
                                variant="top"
                                src={el.miniature}
                                style={{ aspectRatio: 16 / 9 }}
                            />
                            <Card.Body>
                                <Card.Title>{el.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                  
                                    <p>
                                        Minimum {el.minPlayers} joueur(s)
                                    </p>
                                    <p>
                                        Maximum {el.maxPlayers} joueur(s)
                                    </p>
                                </Card.Subtitle>
                                <Card.Text></Card.Text>

                                <div
                                    className="d-flex"
                                    style={{
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Button
                                        variant="primary"
                                    >
                                        Détail
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <h2 className="text-primary text-center mt-4">
                        Aucun jeux créé
                    </h2>
                )}
            </div>

        </div>
    );
}

export default ListesJeux;
