import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/showtimes/AddShowtimeModal.css";
import axios from "axios";

interface AddShowtimeModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (showtime: { movieId: number; theaterId: number; startTime: string; price: number }) => void;
}

const AddShowtimeModal: React.FC<AddShowtimeModalProps> = ({ show, handleClose, handleSave }) => {
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [theaters, setTheaters] = useState<{ id: number; name: string }[]>([]);
  const [showtimeData, setShowtimeData] = useState({
    movieId: "",
    theaterId: "",
    startTime: "",
    price: "",
  });

  useEffect(() => {
    if (show) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/movies`)
        .then((response) => setMovies(response.data))
        .catch((error) => console.error("Error fetching movies:", error));

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/theaters`)
        .then((response) => {setTheaters(response.data);
        })
        .catch((error) => console.error("Error fetching theaters:", error));
    }
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShowtimeData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormInvalid = Object.values(showtimeData).some((value) => value === "");

  const handleSubmit = () => {
    if (isFormInvalid) {
      alert("❌ All fields must be filled before saving.");
      return;
    }    
    handleSave({
      movieId: parseInt(showtimeData.movieId, 10),
      theaterId: parseInt(showtimeData.theaterId, 10),
      startTime: showtimeData.startTime,
      price: parseFloat(showtimeData.price),
    });

    handleClose();
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add a New Showtime</h5>
          </div>
          <div className="modal-body">
            <form>
              {/* Movie Selection */}
              <div className="form-group">
                <label>Movie</label>
                <select className="form-control" name="movieId" value={showtimeData.movieId} onChange={handleChange}>
                  <option value="">Select a movie</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theater Selection */}
              <div className="form-group">
                <label>Theater</label>
                <select className="form-control" name="theaterId" value={showtimeData.theaterId} onChange={handleChange}>
                  <option value="">Select a theater</option>
                  {theaters.map((theater) => (
                    <option key={theater.id} value={theater.id}>
                      {theater.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div className="form-group">
                <label>Start Time</label>
                <input type="datetime-local" className="form-control" name="startTime" value={showtimeData.startTime} onChange={handleChange} />
              </div>

              {/* Price */}
              <div className="form-group">
                <label>Price</label>
                <input type="number" className="form-control" name="price" value={showtimeData.price} onChange={handleChange} />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={handleClose}>Cancel ❌</button>
            <button className="save-btn" onClick={handleSubmit} disabled={isFormInvalid}>Save ✅</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShowtimeModal;
