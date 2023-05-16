import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import appRoutes from '../../../routes/routes';

const SalleJeu = () => {
    return (
        <div className="container-fluid mt-5 pt-2">
            {/*Start page head*/}
            <div className="d-flex justify-content-between align-items-center p-2 my-2 bg-light">
                <div>
                    <h2>Nom du jeu</h2>
                </div>
                <div>
                    <Button variant="primary" href={appRoutes.SALONS}>
                        Retour
                    </Button>
                </div>
            </div>
            {/*End page head*/}

<div className='bg-light p-2 my-2'>
<Row>
                <Col md={9}>
                    <div className='jeux-content'>
                        SALLE DE JEU
                    </div>
                </Col>
                <Col md={3}>
                <div className='tchat-content'>
                <div className="message-content">
                <div className="message-sender">Salut</div>
                <div className="message-receiver">Salut ça va?</div>
                </div>
                <div className="input-message">
                    <input type="text" placeholder='Entre votre message...' />
                </div>
                </div>
                </Col>
            </Row>
</div>
           
        </div>
    );
};

export default SalleJeu;
