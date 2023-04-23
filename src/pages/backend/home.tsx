import TableCustom from "../../components/TableCustom";
import Widget from "../../components/widget";

const Home = () => {
    return (
       <div className="page-wrapper">
        <div className="widgets">
            <Widget type="jeux"/>
            <Widget type="amis"/>
            <Widget type="salons"/>
        </div>
        <div className="freind-list">
            <div className="freind-list-title">
                Mes meilleurs amis
            </div>
            <TableCustom/>
        </div>
       </div>
    )
}

export default Home;