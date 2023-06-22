import {useEffect, useState} from 'react';
import {Button, Card, Form, Modal} from 'react-bootstrap';
import {
    AnswerLobbyInvitation,
    CreateLobby,
    GetAllUserInvitations,
    ListGames,
    ListLobby,
} from '../../../service/frontendService';
import {useNavigate} from 'react-router-dom';

const ListesSalon = () => {
    const navigate = useNavigate();
    const [showAddLobby, setShowAddLobby] = useState(false);
    const [showInvitation, setShowInvitation] = useState(false);
    const [nomSalon, setNomSalon] = useState('');
    const [idJeu, setIdJeu] = useState('');
    const [lobbies, setLobbies] = useState([]);
    const [games, setGames] = useState([]);
    const [invitations, setInvitations] = useState([]);

    useEffect(() => {
        handleLoadLobby();
    }, []);
    const tokenString = localStorage.getItem('auth');
    const userToken = JSON.parse(tokenString);
    const user = userToken?.token;
    const handleSubmit = async (e) => {
        e.preventDefault();

        const results = await CreateLobby({
            name: nomSalon,
            user: user.id,
            game: idJeu,
            private: true,
        });
        handleCloseAddLobby();
        handleLoadLobby();
        console.log(results);
    };

    const handleLoadLobby = async () => {
        const results = await ListLobby(user.id);
        setLobbies(results.lobbies);

        const res = await ListGames();
        setGames(res.games);
    };
    const handleJeuChange = (e) => {
        setIdJeu(e.target.value);
    };
    const handleCloseAddLobby = () => setShowAddLobby(false);
    const handleShowAddLobby = () => setShowAddLobby(true);
    const handleShowInvitation = async () => {
        const result = await GetAllUserInvitations(user.id);
        setInvitations(result.invitations);
        setShowInvitation(true);
    }
    const handleCloseInvitation = () => setShowInvitation(false);


    const playGame = (lobby: any) => {
        localStorage.setItem('info',
            JSON.stringify({info: lobby}));
        navigate(`/dashboard/salle-jeu/${lobby.game.id}`);
    };

    const AcceptLobbyInvitation = (id, p) => {
        const result = AnswerLobbyInvitation(id, p);
    };

    const DenyLobbyInvitation = (id, p) => {
        const result = AnswerLobbyInvitation(id, p);
    }

    return (
        <div className="container mt-5 pt-2">
            <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
                <div>
                    <h2>Liste des salons</h2>
                </div>
                <div>
                    <Button variant="outline-primary" onClick={handleShowInvitation}>
                        Voir les invitations
                    </Button>
                    <Button variant="primary" onClick={handleShowAddLobby}>
                        Ajouter un salon
                    </Button>
                </div>
            </div>

            <div className="cs-grid p-2 bg-light">
                {lobbies.length > 0 ? (
                    lobbies.map((el, index) => (
                        <Card key={index}>
                            <Card.Img
                                variant="top"
                                src={el.game.miniature}
                                style={{aspectRatio: 16 / 9}}
                            />
                            <Card.Body>
                                <Card.Title>{el.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    <p>
                                        {el.participants.length} participant(s)
                                        actuelle
                                    </p>
                                    <br/>
                                    <p>
                                        Minimum {el.game.minPlayers} joueur(s)
                                    </p>
                                    <p>
                                        Maximum {el.game.maxPlayers} joueur(s)
                                    </p>
                                </Card.Subtitle>
                                <Card.Text></Card.Text>
                                {el.participants.length ==
                                el.game.minPlayers ? (
                                    <div
                                        className="d-flex"
                                        style={{
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Button
                                            variant="primary"
                                            onClick={() => playGame(el)}
                                            className="me-2"
                                        >
                                            Jouer
                                        </Button>
                                        <Button
                                            variant="warning"
                                            href={'/dashboard/salon/' + el.id}
                                        >
                                            Modifier
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="warning"
                                        href={'/dashboard/salon/' + el.id}
                                        className="w-100"
                                    >
                                        Modifier
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <h2 className="text-primary text-center mt-4">
                        Aucun salon créé
                    </h2>
                )}
            </div>

            <Modal show={showAddLobby} onHide={handleCloseAddLobby}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un salon</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="nomSalon">
                            <Form.Label>Nom du salon</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nom du salon"
                                onChange={(e) => setNomSalon(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="nomJeu">
                            <Form.Label>Jeu</Form.Label>
                            <Form.Select
                                aria-label="Jeu"
                                value={idJeu}
                                onChange={handleJeuChange}
                            >
                                <option>Selectionnez un jeu</option>
                                {games.map((game) => (
                                    <option key={game.id} value={game.id}>
                                        {game.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAddLobby}>
                            Fermer
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Ajouter
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={showInvitation} onHide={handleCloseInvitation}>
                <Modal.Header closeButton>
                    <Modal.Title>Voir les invitations reçus</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {invitations.map((invitation) => (
                            <div key={invitation.id}
                                 className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
                                <div key={invitation.lobby.id}>{invitation.lobby.name}</div>
                                <div>{invitation.lobby.creator.name}</div>
                                <div>{invitation.lobby.game.name}</div>
                                <Button variant="primary" onClick={() => AcceptLobbyInvitation(invitation.id, {
                                    userId: user.id,
                                    lobbyId: invitation.lobby.id,
                                    response: "ACCEPTED"
                                })}>
                                    Accepter
                                </Button>
                                <Button variant="outline-danger" onClick={() => DenyLobbyInvitation(invitation.id, {
                                    userId: user.id,
                                    lobbyId: invitation.lobby.id,
                                    response: "REJECTED"
                                })}>
                                    Refuser
                                </Button>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseInvitation}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListesSalon;
