import React, { useEffect, useState } from "react";
import { Button, Card, Modal,Form } from "react-bootstrap";
import callOfDuty from "../../../assets/images/jeux/callOfDuty.jpg"
import client from "../../../api/api";

const ListesSalon = () => {
  const [show, setShow] = useState(false);
  const [nomSalon, setNomSalon] = useState();
  const [idJeu, setIdJeu] = useState();
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    handleLoadLobby();
  },[])

  const handleSubmit = async (e) =>{
 e.preventDefault()
    const tokenString = localStorage.getItem('auth');
    const userToken = JSON.parse(tokenString);
    const user = JSON.parse(atob(userToken.token));
   
     const results = await client.post('/lobby',{
        "name" : nomSalon,
        "user" : user.id,
        "game" : idJeu,
        "private" : true
    });
    handleClose();
    handleLoadLobby();
    console.log(results);
  }

  const handleLoadLobby = async () => {
    const results = await client.get('/lobby');
    
    setLobbies(results.data)
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container mt-5 pt-2">
      {/*Start page head*/}
      <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
        <div>
          <h2>Liste des salons</h2>
        </div>
        <div>
          <Button variant="primary" onClick={handleShow}>Ajouter un salon</Button>
        </div>
      </div>
      {/*End page head*/}

      <div className="cs-grid p-2 bg-light">

        {lobbies.map((el) => (
           <Card  key={el.id}>
           <Card.Img variant="top" src={callOfDuty} />
           <Card.Body>
             <Card.Title>{el.name}</Card.Title>
             <Card.Subtitle className="mb-2 text-muted">3 participants</Card.Subtitle>
             <Card.Text>
 
             </Card.Text>
             <Button variant="primary" href={"/dashboard/salle-jeu/" + el.id} className="me-2">Jouer</Button>
             <Button variant="warning" href={"/dashboard/salon/" + el.id}>Modifier</Button>
           </Card.Body>
         </Card>
        ))}
       
      </div>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un salon</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="nomSalon">
              <Form.Label>Nom du salon</Form.Label>
              <Form.Control type="text" placeholder="Nom du salon" onChange={(e) => setNomSalon(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="nomJeu">
              <Form.Label>Jeu</Form.Label>
              <Form.Select aria-label="Jeu" onChange={(e) => setIdJeu(e.target.value)} >
                <option >Selectionnez un jeu</option>
                <option value="5b08a18c-e224-11ed-b5ea-0242ac120002">Jeu 1</option>
              </Form.Select>

            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Ajouter
            </Button>
          </Modal.Footer>
        </Form>

      </Modal>

    </div>
  );
};

export default ListesSalon;