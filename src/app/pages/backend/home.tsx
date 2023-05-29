import { Carousel } from 'react-bootstrap';
import callOfDuty from '../../assets/images/jeux/callOfDuty.jpg';
import fifa23 from '../../assets/images/jeux/fifa23.jpg';
import pubg from '../../assets/images/jeux/pubg.jpg';
import { useEffect, useState } from 'react';
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
                {games.map((el, index) => (
                    <Carousel.Item key={index}>
                        <img
                            className="d-block w-100"
                            style={{height: "500px"}}
                            src={el.miniature}
                            alt={el.name}
                        />
                        <Carousel.Caption>
                            <h3>{el.name}</h3>
                            <p>{el.description}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default Home;
