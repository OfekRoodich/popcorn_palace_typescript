import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/showtimes/ShowTimePage.css"; 
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip"; 
import AddShowtimeModal from "./AddShowtimeModal"; 
import EditShowtimeModal from "./EditShowtimeModal"; 


const ShowtimesPage: React.FC = () => {
  const [showtimes, setShowtimes] = useState<
    { id: number; movie: { id: number; title: string,duration:number}; theater: { id: number; name: string}; startTime: string; endTime: string; price: number }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
const [selectedShowtime, setSelectedShowtime] = useState<any>(null)
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/showtimes`)
      .then(response => {
        setShowtimes(response.data);
      })
      .catch(error => console.error('Error fetching showtimes:', error));
  }, []);

  const handleBack = () => {
    navigate("/");
  };
  const handleEdit = (showtime: any) => {
    setSelectedShowtime(showtime);
    setShowEditModal(true);
  };
  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this showtime?");
    if (isConfirmed) {
      axios.delete(`${process.env.REACT_APP_API_BASE_URL}/showtimes/${id}`)
        .then(() => {
          setShowtimes(showtimes.filter(showtime => showtime.id !== id));
        })
        .catch(error => console.error('Error deleting showtime:', error));
    }
  };
  const handleUpdateShowtime = (updatedShowtime: any) => {
    axios.put(`${process.env.REACT_APP_API_BASE_URL}/showtimes/${updatedShowtime.id}`, updatedShowtime)
      .then(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/showtimes/${updatedShowtime.id}`)
          .then(response => {
            setShowtimes(showtimes.map(st => (st.id === updatedShowtime.id ? response.data : st)));
            setShowEditModal(false);
          })
          .catch(error => console.error("Error fetching updated showtime:", error));
      })
      .catch(error => console.error("Error updating showtime:", error));
  };
  
  const handleAddShowtime = (newShowtime: any) => {

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/showtimes`, newShowtime)
      .then((response) => {
        setShowtimes([...showtimes, response.data]);
        setShowModal(false);
      })
      .catch((error) => console.error("Error adding showtime:", error));
  };

  return (
    <div className="showtimes-container">
      {(showModal ||showEditModal) && <div className="page-overlay"></div>}
      <div className="back-btn-container">
        <button className="menu-btn" onClick={() => setShowModal(true)}>Add a Showtime ➕</button>
        <button className="menu-btn" onClick={handleBack}>Back ➡️</button>
      </div>
      <h1 className="showtimes-title">Showtimes 🕒</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Theater</strong></TableCell>
              <TableCell><strong>Start Time</strong></TableCell>
              <TableCell><strong>End Time</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Book Tickets</strong></TableCell>
              <TableCell  align="right"><strong>Edit</strong></TableCell>
              <TableCell align="right"><strong>Delete</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showtimes.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map((showtime) => (
              <TableRow key={showtime.id}>
                <TableCell>{showtime.movie?.title || "Unknown Movie"}</TableCell>
                <TableCell>{showtime.theater?.name || 'Unknown Theater'}</TableCell>
                <TableCell>{new Date(showtime.startTime).toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(new Date(showtime.startTime).getTime() + showtime.movie.duration * 60000).toLocaleString()}
                </TableCell>
                <TableCell>{showtime.price}₪</TableCell>
                <TableCell className="buy-tickets-button">
                  <p className="buy-tickets-text">
                  Buy Tickets
                    </p></TableCell >
                    <TableCell align="right">
                  <Tooltip title="Edit">
                    <button className="edit-btn"  onClick={() => handleEdit(showtime)}>✏️</button>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Delete">
                    <button className="delete-btn" onClick={() => handleDelete(showtime.id)}>🗑️</button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddShowtimeModal show={showModal} handleClose={() => setShowModal(false)} handleSave={handleAddShowtime} />
      <EditShowtimeModal show={showEditModal} handleClose={() => setShowEditModal(false)} handleUpdate={handleUpdateShowtime} 
  showtime={selectedShowtime} 
/>
    </div>
  );
};

export default ShowtimesPage;
