import React, { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Col,
    Form,
    Modal,
    Row,
    Tab,
    Table,
    Tabs,
} from 'react-bootstrap';
import {
    AddFriend,
    AnswerInvitation,
    ListInvitationReceived,
    ListInvitationSend,
    ListMyFriends,
    researchUser,
} from '../../../service/frontendService';

const ListesAmis = () => {
    const tokenString = localStorage.getItem('auth');
    const userToken = JSON.parse(tokenString);
    const user = userToken?.token;

    const [show, setShow] = useState(false);
    const [username, setUsername] = useState(null);
    const [friends, setFriends] = useState([]);
    const [myFriends, setMyFriends] = useState([]);

    const [senders, setSenders] = useState([]);
    const [receivers, setReceivers] = useState([]);

    const [key, setKey] = useState("0");

    useEffect(() => {
        handleLoadMyFriend();
    }, []);
    const functGet = (k) => {
        if (k == "2") handleLoadReceiver();
        if (k == "1") handleLoadSender();
        else handleLoadMyFriend();
    };
    const handleClose = () => {
        functGet(key);
        setShow(false);
    };
    const handleShow = () => {
        setFriends([]);
        setShow(true);
    };

    const handleSearch = async () => {
        const result = await researchUser(user.id, username);
        setFriends(result);
    };

    const handleAddFriend = async (friendId) => {
        AddFriend(friendId, {
            sender: user.id ,
        });
        setFriends([]);
        setUsername(null);
        handleClose();
        handleLoadSender();
        setKey("0")
    };
    const handleLoadSender = async () => {
        const result = await ListInvitationSend(user.id);
        setSenders(result.requests);
    };
    const handleLoadMyFriend = async () => {
        const result = await ListMyFriends(user.id);
        setMyFriends(result.requests);
    };
    const handleLoadReceiver = async () => {     
        const result = await ListInvitationReceived(user.id);
        setReceivers(result.requests);
    };

    const handleValidate = async (statut: String, id: String) => {
        const result = await AnswerInvitation(user.id, {
            sender: id,
            status: statut,
        });
        window.location.reload();
    };

    return (
        <div className="container mt-5 pt-2">
            <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
                <div>
                    <h2>Listes des amis</h2>
                </div>
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        Ajouter un ami
                    </Button>
                </div>
            </div>
            <Tabs
                activeKey={key}
                onSelect={(k) => {
                    setKey(k);
                    functGet(k);
                }}
                className="my-3"
            >
                <Tab eventKey="0" title="Mes amis">
                    <Table bordered hover>
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Nom d'utilisateur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myFriends.length > 0 ? (
                                myFriends.map(
                                    (el, index) =>(
                                            <tr key={index}>
                                                <td>{el.user.name} ({el.user.email})</td>
                                                <td>
                                                    {/* <Button variant="outline-danger">
                                                        Retirer
                                                    </Button> */}
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
                </Tab>
                <Tab eventKey="1" title="Demande envoyer">
                    <Table bordered hover>
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Nom d'utilisateur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {senders.length > 0 ? (
                                senders.map(
                                    (el, index) =>
                                        el.friend.id !== el.user && (
                                            <tr key={index}>
                                                <td>{el.friend.name}</td>
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
                                    Aucune invitation envoyé
                                </h2>
                            )}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="2" title="Demande en attente">
                    <Table bordered hover>
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Nom d'utilisateur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receivers.length > 0 ? (
                                receivers.map(
                                    (el, index) =>
                                        el.user.id !== el.friend && (
                                            <tr key={index}>
                                                <td>{el.user.name}</td>
                                                <td>
                                                    <ButtonGroup>
                                                        <Button
                                                            variant="outline-success"
                                                            onClick={() =>
                                                                handleValidate(
                                                                    'ACCEPTED',
                                                                    el.user.id
                                                                )
                                                            }
                                                        >
                                                            Accepter
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() =>
                                                                handleValidate(
                                                                    'REJECTED',
                                                                    el.user.id
                                                                )
                                                            }
                                                        >
                                                            Rejeter
                                                        </Button>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>
                                        )
                                )
                            ) : (
                                <h2 className="text-primary text-center mt-4">
                                    Aucune invitation recu
                                </h2>
                            )}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un ami</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Control
                                type="text"
                                placeholder="Nom d'utilisateur"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Button
                                variant="primary"
                                className="mt-2"
                                onClick={handleSearch}
                            >
                                Recherche
                            </Button>
                        </Form.Group>
                    </Form>
                    {friends.length > 0 ? (
                        friends.map(
                            (friend, index) =>
                                friend.id !== friend.user && (
                                    <Row
                                        className="p-2 my-2 bg-light align-items-center"
                                        key={index}
                                    >
                                        <Col md="8" sm="6">
                                            <h3>{friend.name}</h3>
                                        </Col>
                                        <Col md="4" sm="6">
                                            <Button
                                                variant="info"
                                                onClick={() =>
                                                    handleAddFriend(friend.id)
                                                }
                                            >
                                                Invitation
                                            </Button>
                                        </Col>
                                    </Row>
                                )
                        )
                    ) : (
                        <h2 className="text-primary text-center mt-4">
                            Aucun ami trouvé
                        </h2>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ListesAmis;
