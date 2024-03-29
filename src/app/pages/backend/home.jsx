import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Carousel,
  ListGroup,
  Modal,
  Table,
} from "react-bootstrap";
import {
  ListGames,
  getRankingByGame,
  getRankingByUser,
} from "../../service/frontendService";

const Home = () => {
  const [games, setGames] = useState([]);
  const [rankingGame, setRankingGame] = useState([]);
  const [rankingUser, setRankingUser] = useState([]);
  const [load, setLoad] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const list = async () => {
    const result = await ListGames();
    setRankingGame([]);
    let data = [];
    for (let key in result.games) {
      const element = await getListUserGame(result, key);
      data.push(element);
    }
    setRankingGame(data);

    setLoad(false);
    setGames(result.games);
  };
  const getListUserGame = async (result, key) => {
    if (result.games.hasOwnProperty(key)) {
      let res = result.games[key];
      const ranking = await getRankingByGame(res.id);
      const data = {
        game: res,
        ranking: ranking,
      };
      return data;
    }
  };
  useEffect(() => {
    list();
  }, []);
  // useEffect(() => {}, [rankingGame, games]);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleShowModal = async (id) => {
    const user = await getRankingByUser(id);
    setRankingUser(user.rankings);
    setShowModal(true);
  };
  return (
    <div className="mt-5">
      {load ? (
        <div className="register">Loading ...</div>
      ) : (
        <>
          <Carousel>
            {games.length > 0 ? (
              games.map((el, index) => (
                <Carousel.Item key={index} style={{ backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(117, 19, 93, 0.73)), url(${el.miniature})`, height: "550px", width:"100%", backgroundSize : "cover", backgroundPosition : "center" }}>
                 
                  <Carousel.Caption>
                    <h3>{el.name}</h3>
                    <p>{el.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))
            ) : (
              <h2 className="text-primary text-center mt-4">Aucun jeu créé</h2>
            )}
          </Carousel>
          <div className="container my-5">
            <div className="row">
              {rankingGame.length > 0 && (
                <h2
                  className="col-12 text-center fw-bold text-primary mb-2"
                  style={{ fontSize: "revert" }}
                >
                  Les classements
                </h2>
              )}
              {rankingGame.length > 0 &&
                rankingGame.map(
                  (rank, i) =>
                    rank?.ranking.globalRanking.length > 0 && (
                      <div className="col-md-4 col-12 p-2" key={i}>
                        <ListGroup variant="flush">
                          <ListGroup.Item variant="primary">
                            {" "}
                            <span className="fw-bold">{rank?.game.name}</span>
                          </ListGroup.Item>
                          {rank?.ranking.globalRanking.map(
                            (ranks, ind) =>
                              ranks.score > 0 && (
                                <ListGroup.Item
                                  className="d-flex justify-content-between align-items-center"
                                  action
                                  onClick={() => handleShowModal(ranks.user.id)}
                                  key={ind}
                                >
                                  <div className="user-avata">{ind + 1}</div>
                                  <div className="ms-2 me-auto">
                                    <div className="fw-bold">
                                      {" "}
                                      {ranks.user.name}{" "}
                                    </div>
                                    {ranks.user.email}
                                  </div>
                                  <Badge bg="primary" pill>
                                    {ranks.score}
                                  </Badge>
                                </ListGroup.Item>
                              )
                          )}
                        </ListGroup>
                      </div>
                    )
                )}
            </div>
          </div>
        </>
      )}

      <Modal size="lg" show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Détail du joueur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column  align-items-center w-100 mb-4">
            <div className="user-avata-with">
              {rankingUser[0]?.player.name.substring(2, 0).toUpperCase()}
            </div>
            <h3 className="fw-bold my-2">{rankingUser[0]?.player.name}</h3>
            <p>{rankingUser[0]?.player.email}</p>
          </div>
          <Table bordered hover>
            <thead>
              <tr>
                <th className="fw-bold">Noms du jeux</th>
                <th className="fw-bold">Scores</th>
              </tr>
            </thead>
            <tbody>
              {rankingUser.map((el, index) => (
                <tr key={index}>
                  <td>
                    <h3 className="fw-bold">{el.game.name}</h3>
                    <p className="truncate-text-cs">{el.game.description}</p>
                  </td>
                  <td>
                    <Badge bg="primary" pill>
                      {el.score}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
