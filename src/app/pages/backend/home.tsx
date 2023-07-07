import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { ListGames, getRankingByGame } from '../../service/frontendService';

const Home = () => {
    const [games, setGames] = useState([]);
    const [rankingGame, setRankingGame] = useState([]);
    const [load, setLoad] = useState(true);

    const list = async () => {
        const result = await ListGames();
        setRankingGame([]);
        for (let key in result.games) {
            if (result.games.hasOwnProperty(key)) {
                let res = result.games[key];
                const ranking = await getRankingByGame(res.id);
                const data = {
                    game: res,
                    ranking: ranking,
                };
                setRankingGame((prevRankingGame) => [
                    ...prevRankingGame,
                    [data],
                ]);
            }
        }

        console.log('ddddddddd ', rankingGame);
        setLoad(false);
        setGames(result.games);
    };

    useEffect(() => {
        list();
    }, []);
    useEffect(() => {}, [rankingGame, games]);
    useEffect(() => {}, [games]);
    return (
        <div className="mt-5">
            {load ? (
                <div className="register">Loading ...</div>
            ) : (
                <>
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
                    {rankingGame.length > 0 &&
                        rankingGame.map(
                            (rank, i) =>
                                rank[0]?.ranking.globalRanking.length > 0 && (
                                    <Accordion defaultActiveKey="0" key={i}>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>
                                                {rank[0]?.game.name}
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {rank[0]?.ranking.globalRanking.map(
                                                    (ranks, ind) => (
                                                        <>
                                                            {ranks.user.email} 
                                                            <br></br>
                                                            Lorem ipsum dolor
                                                            sit amet,
                                                            consectetur
                                                            adipiscing elit, sed
                                                            do eiusmod tempor
                                                            incididunt ut labore
                                                            et dolore magna
                                                            aliqua. Ut enim ad
                                                            minim veniam, quis
                                                            nostrud exercitation
                                                            ullamco laboris nisi
                                                            ut aliquip ex ea
                                                            commodo consequat.
                                                            Duis aute irure
                                                            dolor in
                                                            reprehenderit in
                                                            voluptate velit esse
                                                            cillum dolore eu
                                                            fugiat nulla
                                                            pariatur. Excepteur
                                                            sint occaecat
                                                            cupidatat non
                                                            proident, sunt in
                                                            culpa qui officia
                                                            deserunt mollit anim
                                                            id est laborum.
                                                        </>
                                                    )
                                                )}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                )
                        )}
                </>
            )}
        </div>
    );
};

export default Home;
