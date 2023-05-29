import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
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
                                style={{ height: '500px' }}
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
        </div>
    );
};

export default Home;
