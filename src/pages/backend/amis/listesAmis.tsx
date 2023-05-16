import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Modal,
    Form,
    Row,
    Col,
    Tabs,
    Tab,
    Table,
    ButtonGroup,
} from 'react-bootstrap';
import client from '../../../api/api';

const ListesAmis = () => {
    const tokenString = localStorage.getItem('auth');
    const userToken = JSON.parse(tokenString);
    const user = JSON.parse(atob(userToken.token));

    const [show, setShow] = useState(false);
    const [username, setUsername] = useState(null);
    const [friend, setFriend] = useState({});

    const [senders, setSenders] = useState([]);
    const [receivers, setReceivers] = useState([]);

    const [key, setKey] = useState('friends');

    useEffect(() => {
        handleLoadSender();
        handleLoadReceiver();
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSearch = async () => {
        const result = await client.get(`/user/name/${username}`);
        console.log(result.data);
        setFriend(result.data);
    };

    const handleAddFriend = async () => {
        const result = await client.post(`/friend/${user.id}`, {
            receiver: friend.id,
        });

        setFriend({});
        setUsername(null);
        handleClose();
    };

    const handleLoadSender = async () => {
        const result = await client.get(`/friend/sent/${user.id}`);
        setSenders(result.data);
    };
    const handleLoadReceiver = async () => {
        const result = await client.get(`/friend/received/${user.id}`);
        setReceivers(result.data);
    };

    const handleValidate = async (statut: String, id: String) => {
        const result = await client.put(`/friend/${user.id}/answer`, {
            receiver: id,
            status: statut,
        });
        handleLoadSender();
        handleLoadReceiver();
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
                    <Table  bordered hover>
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
                            {senders.map((el, index) => (
                                <tr key={index}>
                                    <td>{el.friend.name}</td>
                                    <td>
                                        <Button variant="outline-danger">
                                            Annuler
                                        </Button>
                                    </td>
                                </tr>
                            ))}
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
                            {receivers.map((el, index) => (
                                <tr key={index}>
                                    <td>{el.user.name}</td>
                                    <td>
                                        <ButtonGroup>
                                            <Button variant="outline-success">
                                                Accepter
                                            </Button>
                                            <Button variant="outline-danger">
                                                Rejeter
                                            </Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))}
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
                                {' '}
                                Recherche{' '}
                            </Button>
                        </Form.Group>
                    </Form>

                    <Row className="p-2 my-2 bg-light align-items-center">
                        <Col md="8">
                            <h3>{friend.name}</h3>
                        </Col>
                        <Col md="4">
                            <Button variant="info" onClick={handleAddFriend}>
                                Invitation
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ListesAmis;
