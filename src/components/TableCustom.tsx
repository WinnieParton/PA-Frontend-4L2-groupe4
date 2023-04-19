import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';

const TableCustom = () => {
    const rows = [
        {
            username : 'moneld',
            img : 'https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640',
            salon : ['pokemon','packman','naruto']
        },
        {
            username : 'winnie',
            img : 'https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640',
            salon : ['pokemon','packman','naruto']
        },
        {
            username : 'arthur',
            img : 'https://unsplash.com/photos/IF9TK5Uy-KI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgxOTA1NjMx&force=true&w=640',
            salon : ['pokemon','packman','naruto']
        }
    ];
  return (
    <TableContainer component={Paper} className='table-custom'>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Photo</TableCell>
            <TableCell className='table-custom-cell'>Nom d'utilisateur</TableCell>
            <TableCell className='table-custom-cell'>Salons</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.username}>
              <TableCell className='table-custom-cell'>
                <img className='image' src={row.img} alt="" />
              </TableCell>
              <TableCell className='table-custom-cell'>{row.username}</TableCell>
              <TableCell className='table-custom-cell'>
                {row.salon.map((el,index) => (
                  <Chip key={index} label={el} />
                )) }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableCustom