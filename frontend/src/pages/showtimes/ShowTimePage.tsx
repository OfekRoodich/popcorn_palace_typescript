import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import "../../styles/showtimes/ShowTimePage.css"; 
import "../../styles/general/GeneralPage.css";


const ShowtimesPage: React.FC = () => {
  const [showtimes, setShowtimes] = useState<
    { id: number; movie: { id: number; title: string; duration: number }; theater: { id: number; name: string; numberOfRows: number; numberOfColumns: number }; startTime: string; price: number, bookedCount: number;  }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [addError, setAddError] = useState("");
  const [editError, setEditError] = useState("");


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
      .catch((error) => {
        const message = error.response?.data?.message || "❌ Failed to edit showtime.";
        setEditError(message);
      });
  };

  const handleAddShowtime = (newShowtime: any) => {
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/showtimes`, newShowtime)
      .then((response) => {
        setShowtimes([...showtimes, response.data]);
        setShowModal(false);
        setAddError("");
      })
      .catch((error) => {
        const message = error.response?.data?.message || "❌ Failed to add showtime.";
        setAddError(message);
      });
  };
  

  const handleOpenBooking = (showtime: any) => {
    navigate(`/book/${showtime.id}`);
  };

  return (
    <div className="showtimes-container">
      {(showModal || showEditModal) && <div className="page-overlay"></div>}
      <div className="back-btn-container">
        <button className="menu-btn" onClick={() => setShowModal(true)}>Add a Showtime ➕</button>
        <button className="menu-btn" onClick={handleBack}>Back ➡️</button>
      </div>
      <h1 className="showtimes-title">Showtimes 🕒</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Theater</strong></TableCell>
              <TableCell><strong>Start Time</strong></TableCell>
              <TableCell><strong>End Time</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Book Tickets</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Edit</strong></TableCell>
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
                 <button className="buy-tickets-btn" disabled={showtime.theater.numberOfColumns * showtime.theater.numberOfRows==showtime.bookedCount}>
                 <p className="buy-tickets-text" onClick={() => handleOpenBooking(showtime)} >Buy Tickets</p>
                  </button> 
                </TableCell>
                <TableCell>
                  {(() => {
                    const totalSeats = showtime.theater.numberOfColumns * showtime.theater.numberOfRows;
                    const seatsByPrecents = (showtime.bookedCount / totalSeats)*100;

                    if (seatsByPrecents === 100) {
                      return <span className="text-danger"><strong>Sold Out</strong></span>;
                    } else if (seatsByPrecents >= 90) {
                      return <span className="text-danger">Last Seats</span>;
                    } else if (seatsByPrecents >= 33) {
                      return <span className="text-warning">Limited</span>;
                    } else {
                      return <span className="text-success" >Available</span>;
                    }
                  })()}
                </TableCell>
                <TableCell align="right">
                <Tooltip title={showtime.bookedCount > 0 ? "Cannot edit a showtime with booked tickets" : "Edit"}>
                  <span>
                    <button 
                      className="edit-showtime-btn" onClick={() => handleEdit(showtime)} disabled={showtime.bookedCount > 0} >✏️
                    </button>
                  </span>
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

      <AddShowtimeModal
          show={showModal}
          handleClose={() => {
            setShowModal(false);
            setAddError("");
          }}
          handleSave={handleAddShowtime}
          errorMessage={addError}
          />      
      <EditShowtimeModal show={showEditModal} handleClose={() => setShowEditModal(false)} handleUpdate={handleUpdateShowtime} showtime={selectedShowtime}  errorMessage={editError}/>
    </div>
  );
};

export default ShowtimesPage;
