import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/EditShowtimeModal.css";
import axios from "axios";

interface EditShowtimeModalProps {
  show: boolean;
  handleClose: () => void;
  handleUpdate: (updatedShowtime: { id: number; movieId: number; theater: string; startTime: string; endTime: string; price: number }) => void;
  showtime: { id: number; movie: { id: number; title: string }; theater: string; startTime: string; endTime: string; price: number } | null;
}

const EditShowtimeModal: React.FC<EditShowtimeModalProps> = ({ show, handleClose, handleUpdate, showtime }) => {
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [showtimeData, setShowtimeData] = useState({
    movieId: "",
    theater: "",
    startTime: "",
    endTime: "",
    price: "",
  });

  useEffect(() => {
    if (show) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/movies`)
        .then((response) => setMovies(response.data))
        .catch((error) => console.error("Error fetching movies:", error));
    }
  }, [show]);

  // Fill the existing showtime details when modal opens
  useEffect(() => {
    if (showtime) {
      setShowtimeData({
        movieId: showtime.movie.id.toString(),
        theater: showtime.theater,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        price: showtime.price.toString(),
      });
    }
  }, [showtime, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShowtimeData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormInvalid = Object.values(showtimeData).some((value) => value === "");

  const handleSubmit = () => {
    if (isFormInvalid) {
      alert("❌ All fields must be filled before updating.");
      return;
    }

    handleUpdate({
      id: showtime?.id || 0,
      movieId: parseInt(showtimeData.movieId, 10) || 0,
      theater: showtimeData.theater,
      startTime: showtimeData.startTime,
      endTime: showtimeData.endTime,
      price: parseFloat(showtimeData.price),
    });

    handleClose();
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Showtime</h5>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label>Movie</label>
                <select className="form-control" name="movieId" value={showtimeData.movieId} onChange={handleChange}>
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
                <label>End Time</label>
                <input type="datetime-local" className="form-control" name="endTime" value={showtimeData.endTime} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" className="form-control" name="price" value={showtimeData.price} onChange={handleChange} />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={handleClose}>Cancel ❌</button>
            <button className="save-btn" onClick={handleSubmit} disabled={isFormInvalid}>Update ✅</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditShowtimeModal;
