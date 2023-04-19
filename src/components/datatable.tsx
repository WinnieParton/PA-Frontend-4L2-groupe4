import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nom', headerName: 'Nom', width: 130, renderCell: (params) =>{
        return (
            <div className="cell-with-img">
                <img className='cell-img' src={params.row.img} alt="" />
                <span>{params.row.nom}</span>
            </div>
        );
    }
 },
    { field: 'description', headerName: 'Description', width: 400 },
    { field: 'status', headerName: 'Statuts', width: 100,
    renderCell: (params) =>{
        return (
            <div className={`cell-with-status ${params.row.status}`}>{params.row.status} </div>
        );
    } },
];

const rows = [
    { id: 1, nom: 'Snow', status : 'pending', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', img : 'https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640' },
    { id: 2, nom: 'Lannister', status : 'start', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', img : 'https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640' },
    { id: 3, nom: 'Lannister', status : 'paused', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', img : 'https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640' },
];

const Datatable = () => {
    const actions = [   { field: 'action', headerName: 'Actions', width: 200, renderCell: () =>{
        return (
            <div className="cell-action">
                <button className='showBtn' >Voir</button>
                <button className='editBtn' >Editer</button>
                <button className='deleteBtn' >Supprimer</button>
            </div>
        );
    }
 },]
    return (
        <div className="datatable">
            <DataGrid
                rows={rows}
                columns={columns.concat(actions)}
                initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
            />
        </div>
    );
};

export default Datatable;
