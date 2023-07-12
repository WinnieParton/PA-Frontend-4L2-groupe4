import { Button, Col, Form, Row } from "react-bootstrap";
import appRoutes from "../../../routes/routes";
import { useState } from "react";
import { addGame } from "../../../service/frontendService";
import { useNavigate } from 'react-router-dom';

const AjouterJeux = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [miniature, setMiniature] = useState('');
  const [minPlayers, setMinPlayers] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [gameFiles, setGameFiles] = useState();
  
  const [errors, setErrors] = useState<{ name?: string, description?: string, miniature?: string, minPlayers?: string, maxPlayers?: string, gameFiles?: string }>(
    {}
);

  const validateForm = () => {
    let formIsValid = true;
    const newErrors: { name?: string, description?: string, miniature?: string, minPlayers?: string, maxPlayers?: string, gameFiles?: string } = {};
    if (!name) {
        formIsValid = false;
        newErrors.name = 'Nom est obligatoire';
    }
    if (!description) {
        formIsValid = false;
        newErrors.description = 'Description est obligatoire';
    }
    if (!miniature) {
      formIsValid = false;
      newErrors.miniature = 'Miniature est obligatoire';
  }
  if (!minPlayers) {
    formIsValid = false;
    newErrors.minPlayers = 'Joueur Min est obligatoire';
}
if (!maxPlayers) {
  formIsValid = false;
  newErrors.minPlayers = 'Joueur Max est obligatoire';
}

if (!gameFiles) {
  formIsValid = false;
  newErrors.minPlayers = 'Fichier est obligatoire';
}

    setErrors(newErrors);
    return formIsValid;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
console.log(gameFiles)
    let formData = new FormData();
                
        formData.append("name", name);
        formData.append("description", description);
        formData.append("miniature", miniature);
        formData.append("minPlayers", minPlayers);
        formData.append("maxPlayers", maxPlayers);
        formData.append("gameFiles", gameFiles, gameFiles?.name);

    try {
      const game = await addGame(formData);
      if (game) {
        return navigate(appRoutes.JEUX);
      }
  } catch (error) {
      setErrorMessage(true);
  }
  }
};



    return (

      <div className="container mt-5 pt-2">
      <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
          <div>
              <h2>Ajouter un jeu</h2>
          </div>
          <div>
              <Button variant="primary" href={appRoutes.JEUX}>
                  Retour
              </Button>
          </div>
      </div>
      <div className="p-2 my-2 bg-light">
      <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Nom</Form.Label>
        <Form.Control type="text" onChange={(e) => setName(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={3} onChange={(e) => setDescription(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Miniature</Form.Label>
        <Form.Control type="text"  onChange={(e) => setMiniature(e.target.value)} />
      </Form.Group>


      <Row className="mb-3">
      <Form.Group as={Col} className="mb-3" controlId="formBasicPassword">
        <Form.Label>Joueur Min</Form.Label>
        <Form.Control type="number" onChange={(e) => setMinPlayers(e.target.value)}/>
      </Form.Group>

      <Form.Group as={Col} className="mb-3" controlId="formBasicPassword">
        <Form.Label>Joueur Max</Form.Label>
        <Form.Control type="number" onChange={(e) => setMaxPlayers(e.target.value)} />
      </Form.Group>
      </Row>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Fichier</Form.Label>
        <Form.Control type="file" onChange={(e) => setGameFiles(e.target.files[0])} />
      </Form.Group>
      
      <Button variant="primary" type="submit"  onClick={handleSubmit}>
        Ajouter
      </Button>
    </Form>
        </div>
        </div>


    );
}

export default AjouterJeux
function setErrorMessage(arg0: boolean) {
  throw new Error("Function not implemented.");
}
