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


const ShowtimesPage: React.FC = () => {
  const [showtimes, setShowtimes] = useState<
    { id: number; movieId: number; theater: string; startTime: string, endTime: string, price: number }[]
  >([]);

  const navigate = useNavigate(); // For navigating back

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/showtimes`)
      .then(response => setShowtimes(response.data))
      .catch(error => console.error('Error fetching showtimes:', error));
  }, []);

  return (
    <div className="showtimes-container">
      <button className="back-btn" onClick={() => navigate('/')}>🔙 Back</button>
      <h1 className="showtimes-title">Showtimes 🎭</h1>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Theather</TableCell>
            <TableCell align="right">Start Time</TableCell>
            <TableCell align="right">End Time</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showtimes.map((showtime) => (
            <TableRow
              key={showtime.startTime}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {showtime.movieId}
              </TableCell>
              <TableCell align="right">{showtime.theater}</TableCell>
              <TableCell align="right">{showtime.startTime}</TableCell>
              <TableCell align="right">{showtime.endTime}</TableCell>
              <TableCell align="right">{showtime.price}₪</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};

export default ShowtimesPage;
