import { useEffect, useState } from 'react';
import { Accordion, Carousel } from 'react-bootstrap';
import { ListGames } from '../../service/frontendService';

const Home = () => {
    const [games, setGames] = useState([]);
    const list = async () => {
        const result = await ListGames();
        setGames(result.games);
    };
    useEffect(() => {
        list();
    }, []);

    return (
        <div className="mt-5">
            <Carousel className="w-65">
                {games.length > 0 ? (
                    games.map((el, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                style={{ height: '500px',aspectRatio: 16 / 9  }}
                                src={el.miniature}
                                alt={el.name}
                               
                            />
                            <Carousel.Caption>
                                <h3>{el.name}</h3>
                                <p>{el.description}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))
                ) : (
                    <h2 className="text-primary text-center mt-4">
                        Aucun jeu créé
                    </h2>
                )}
            </Carousel>

            <div className="container-fluid mt-5 pt-2">
            <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
            </div>
        </div>
    );
};

export default Home;
