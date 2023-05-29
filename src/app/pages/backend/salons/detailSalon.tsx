import { useEffect, useState } from 'react';
import {
    Button,
    Col,
    Form,
    ListGroup,
    Modal,
    Row,
    Table,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import appRoutes from '../../../routes/routes';
import {
    AddFriendInLobby,
    ListMyFriends,
    getLobby,
} from '../../../service/frontendService';
const DetailSalon = () => {
    const { id } = useParams();
    const [lobby, setLobby] = useState<{
        id?: any;
        name?: string;
        game?: { miniature?: string; name?: string };
        status?: string;
        creator?: any;
        participants?: [{ id?: any; name?: string }];
    }>({});
    const [myFriends, setMyFriends] = useState([]);
    const tokenString = localStorage.getItem('auth');
    const userToken = JSON.parse(tokenString);
    const user = JSON.parse(atob(userToken.token));
    const [show, setShow] = useState(false);
    const [idFriend, setIdFriend] = useState([]);
    useEffect(() => {
        handleLoadLobby();
        handleLoadMyFriend();
    }, []);

    const handleLoadLobby = async () => {
        const results = await getLobby(id);
        setLobby(results);
    };
    const handleLoadMyFriend = async () => {
        setMyFriends([]);
        const result = await ListMyFriends(user.id);
        setMyFriends(result.requests);
    };
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    };
    const handleAddFriendSalon = async () => {
        const result = await AddFriendInLobby(id, user.id, {
            arrayUser: idFriend,
        });
        setLobby(result);
        handleClose();
    };

    const handleFriendChange = (e) => {
        setIdFriend([e.target.value]);
    };
    return (
        <div className="container mt-5 pt-2">
            <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
                <div>
                    <h2>{lobby?.name}</h2>
                </div>
                <div>
                    <Button variant="primary" href={appRoutes.SALONS}>
                        Retour
                    </Button>
                </div>
            </div>
            <div className="p-2 my-2 bg-light">
                <Row>
                    <Col md={6}>
                        <img
                            src={lobby?.game?.miniature}
                            className="img-thumbnail rounded"
                            alt={lobby?.game?.name}
                        />
                    </Col>
                    <Col md={6}>
                        <ListGroup>
                            <ListGroup.Item>
                                {lobby?.game?.name}{' '}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Créé par : {lobby.creator?.name}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={12}>
                        <div className="my-3">
                            <div className="d-flex justify-content-between my-3">
                                <h2>Mes amis du salon</h2>
                                <div>
                                    <Button
                                        variant="primary"
                                        onClick={handleShow}
                                    >
                                        Ajouter des amis au salon
                                    </Button>
                                </div>
                            </div>
                            <Table bordered hover>
                                <thead className="bg-primary text-white">
                                    <tr>
                                        <th>Nom d'utilisateur</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lobby?.participants?.length > 0 ? (
                                        lobby.participants.map(
                                            (el, index) =>
                                                el.id !== user.id && (
                                                    <tr key={index}>
                                                        <td>{el.name}</td>
                                                        <td>
                                                            <Button variant="outline-danger">
                                                                Annuler
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )
                                        )
                                    ) : (
                                        <h2 className="text-primary text-center mt-4">
                                            Aucun ami
                                        </h2>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    Ajouter des amis au salon
                                </Modal.Title>
                            </Modal.Header>
                            <Form>
                                <Modal.Body>
                                    {myFriends.length > 0 ? (
                                        <>
                                            <Form.Select
                                                multiple
                                                value={idFriend}
                                                onChange={handleFriendChange}
                                            >
                                                {myFriends.map((friend) => (
                                                    <option
                                                        key={friend.user.id}
                                                        value={friend.user.id}
                                                    >
                                                        {friend.user.name +
                                                            ' | ' +
                                                            friend.user.email}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Button
                                                variant="info"
                                                onClick={() =>
                                                    handleAddFriendSalon()
                                                }
                                            >
                                                Ajouter
                                            </Button>
                                        </>
                                    ) : (
                                        // {myFriends.length > 0 ? (
                                        //     myFriends.map(
                                        //         (friend, index) =>
                                        //             friend.id !== friend.user && (
                                        //                 <Row
                                        //                     className="p-2 my-2 bg-light align-items-center"
                                        //                     key={index}
                                        //                 >
                                        //                     <Col md="8" sm="6">
                                        //                         <h3>{friend.name}</h3>
                                        //                     </Col>
                                        //                     <Col md="4" sm="6">
                                        //                         <Button
                                        //                             variant="info"
                                        //                             onClick={() =>
                                        //                                 handleAddFriendSalon(
                                        //                                     friend.id
                                        //                                 )
                                        //                             }
                                        //                         >
                                        //                             Ajouter
                                        //                         </Button>
                                        //                     </Col>
                                        //                 </Row>
                                        //             )
                                        //     )

                                        <h2 className="text-primary text-center mt-4">
                                            Aucun ami trouvé
                                        </h2>
                                    )}
                                </Modal.Body>
                            </Form>
                        </Modal>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default DetailSalon;