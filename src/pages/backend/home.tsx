import { Carousel } from "react-bootstrap";
import callOfDuty from "../../assets/images/jeux/callOfDuty.jpg"
import fifa23 from "../../assets/images/jeux/fifa23.jpg"
import pubg from "../../assets/images/jeux/pubg.jpg"


const Home = () => {
    return (
      <div className="container mt-5 pt-2">
        <Carousel className="w-75">
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={callOfDuty}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={fifa23}
              alt="Second slide"
            />

            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={pubg}
              alt="Third slide"
            />

            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    )
}

export default Home;