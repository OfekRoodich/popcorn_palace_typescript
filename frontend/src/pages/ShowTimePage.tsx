import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ShowTimePage.css'; 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip'; 



const ShowtimesPage: React.FC = () => {
  const [showtimes, setShowtimes] = useState<
    { id: number; movie: { title: string }; theater: string; startTime: string, endTime: string, price: number }[]
  >([]);

  const navigate = useNavigate(); // For navigating back

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/showtimes`)
      .then(response => setShowtimes(response.data))
      .catch(error => console.error('Error fetching showtimes:', error));
  }, []);
  const handleBack = () => {
    navigate('/'); // Navigate to Home Page
  };

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this movie?");
    if (isConfirmed) {
      axios.delete(`${process.env.REACT_APP_API_BASE_URL}/movies/${id}`)
        .then(() => {
          setShowtimes(showtimes.filter(showtime => showtime.id !== id));
        })
        .catch(error => console.error('Error deleting movie:', error));
    }
  };

  return (
    <div className="showtimes-container">
  <div className="back-btn-container">
        <button className="menu-btn">Add a Showtime ➕</button>
        <button className="menu-btn" onClick={handleBack}>Back ➡️</button>

      </div>
      <h1 className="showtimes-title">Showtimes 🕒</h1>
      <div>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Theater</strong></TableCell>
            <TableCell><strong>Start Time</strong></TableCell>
            <TableCell><strong>End Time</strong></TableCell>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell><strong>Order</strong></TableCell>
            <TableCell align="right"><strong>Delete</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showtimes.map((showtime) => (
            <TableRow
              key={showtime.startTime}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
              {showtime.movie.title}
              </TableCell>
              <TableCell>{showtime.theater}</TableCell>
              <TableCell>{new Date(showtime.startTime).toLocaleString()}</TableCell>
              <TableCell>{new Date(showtime.startTime).toLocaleString()}</TableCell>
              <TableCell>{showtime.price}₪</TableCell>
              <TableCell>Buy tickets</TableCell>
              <TableCell align="right">
              <Tooltip title={<span>Delete</span>}>
                  <button className="delete-btn"  onClick={() => handleDelete(showtime.id)}>🗑️</button>
              </Tooltip>
             </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    </div>
  );
};

export default ShowtimesPage;
