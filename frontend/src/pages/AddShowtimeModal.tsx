import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AddShowtimeModal.css";
import axios from "axios";

interface AddShowtimeModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (showtime: { movieId: number; theater: string; startTime: string; price: number }) => void;
}

const AddShowtimeModal: React.FC<AddShowtimeModalProps> = ({ show, handleClose, handleSave }) => {
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [showtimeData, setShowtimeData] = useState({
    movieId: "",
    theater: "",
    startTime: "",
    price: "",
  });

  // Load movies from API when modal opens
  useEffect(() => {
    if (show) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/movies`)
        .then((response) => setMovies(response.data))
        .catch((error) => console.error("Error fetching movies:", error));
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
      movieId: parseInt(showtimeData.movieId, 10) || 0,
      theater: showtimeData.theater,
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
              <div className="form-group">
                <label>Theater</label>
                <input type="text" className="form-control" name="theater" value={showtimeData.theater} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input type="datetime-local" className="form-control" name="startTime" value={showtimeData.startTime} onChange={handleChange} />
              </div>
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
