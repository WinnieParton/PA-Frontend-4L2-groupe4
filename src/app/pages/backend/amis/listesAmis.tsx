import { useEffect, useState } from 'react';
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
    researchUser,
} from '../../../service/frontendService';

const ListesAmis = () => {
    const tokenString = localStorage.getItem('auth');
    const userToken = JSON.parse(tokenString);
    const user = JSON.parse(atob(userToken.token));

    const [show, setShow] = useState(false);
    const [username, setUsername] = useState(null);
    const [friends, setFriends] = useState([]);

    const [senders, setSenders] = useState([]);
    const [receivers, setReceivers] = useState([]);

    const [key, setKey] = useState('friends');

    useEffect(() => {
        handleLoadSender();
        handleLoadReceiver();
    }, []);

    useEffect(() => {
        handleLoadSender();
        handleLoadReceiver();
    }, [friends]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSearch = async () => {
        const result = await researchUser(username);
        setFriends(result);
    };

    const handleAddFriend = async (friendId) => {
        const result = AddFriend(user.id, {
            receiver: friendId,
        });
        setFriends([]);
        setUsername(null);
        handleClose();
    };
    const handleLoadSender = async () => {
        const result = await ListInvitationSend(user.id);
        setSenders(result);
    };
    const handleLoadReceiver = async () => {
        const result = await ListInvitationReceived(user.id);
        setReceivers(result);
    };

    const handleValidate = async (statut: String, id: String) => {
        const result = await AnswerInvitation(user.id, {
            receiver: id,
            status: statut,
        });
    };

    return (
        <div className="container mt-5 pt-2">
            {/*Start page head*/}
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
            {/*End page head*/}

            <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="my-3">
                <Tab eventKey="friends" title="Mes amis">
                    <Table bordered hover>
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Nom d'utilisateur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </Table>
                </Tab>
                <Tab eventKey="senders" title="Demande envoyer">
                    <Table bordered hover>
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Nom d'utilisateur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {senders.map(
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
                            )}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="receivers" title="Demande en attente">
                    <Table bordered hover>
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Nom d'utilisateur</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receivers.map(
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
                    {friends.map(
                        (friend, index) =>
                            friend.id !== friend.user && (
                                <Row
                                    className="p-2 my-2 bg-light align-items-center"
                                    key={index}
                                >
                                    <Col md="8">
                                        <h3>{friend.name}</h3>
                                    </Col>
                                    <Col md="4">
                                        <Button
                                            variant="info"
                                            onClick={() =>
                                                handleAddFriend(friend)
                                            }
                                        >
                                            Invitation
                                        </Button>
                                    </Col>
                                </Row>
                            )
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ListesAmis;
