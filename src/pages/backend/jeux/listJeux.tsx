import Datatable from "../../../components/datatable";

const ListJeux = () => {
return  <div className="list-jeux">
    <div className="page-wrapper-header">
    <h2>Liste des jeux</h2>
    <button className="btn-action">Ajouter un jeu</button>
    </div>
        

        <Datatable/>
</div>
}

export default ListJeux;