import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/showtimes/EditShowtimeModal.css";
import axios from "axios";

interface EditShowtimeModalProps {
  show: boolean;
  handleClose: () => void;
  handleUpdate: (updatedShowtime: { id: number; movieId: number; theaterId: number; startTime: string; price: number }) => void;
  showtime: { id: number; movie: { id: number; title: string }; theater: { id: number; name: string }; startTime: string; price: number } | null;
}

const EditShowtimeModal: React.FC<EditShowtimeModalProps> = ({ show, handleClose, handleUpdate, showtime }) => {
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [theaters, setTheaters] = useState<{ id: number; name: string }[]>([]);
  const [existingShowtimes, setExistingShowtimes] = useState<
    { id: number; startTime: string; movie: { duration: number }; theaterId: number }[]
  >([]);
  const [movieDuration, setMovieDuration] = useState<number | null>(null);

  const [showtimeData, setShowtimeData] = useState({
    movieId: 0,
    theaterId: 0,
    startTime: "",
    price: 0,
  });

  useEffect(() => {
    if (show) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/movies`)
        .then((response) => setMovies(response.data))
        .catch((error) => console.error("Error fetching movies:", error));

      axios.get(`${process.env.REACT_APP_API_BASE_URL}/theaters`)
        .then((response) => setTheaters(response.data))
        .catch((error) => console.error("Error fetching theaters:", error));
    } else {
      setMovieDuration(null);
      setExistingShowtimes([]);
    }
  }, [show]);

  useEffect(() => {
    if (showtime) {
      setShowtimeData({
        movieId: showtime.movie.id,
        theaterId: showtime.theater.id,
        startTime: showtime.startTime,
        price: showtime.price,
      });
    }
  }, [showtime]);

  useEffect(() => {
    if (show && showtimeData.movieId) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/movies/${showtimeData.movieId}`)
        .then((res) => setMovieDuration(res.data.duration))
        .catch((err) => console.error("Error fetching movie duration:", err));
    }
  }, [show, showtimeData.movieId]);

  useEffect(() => {
    if (show && showtimeData.theaterId) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/showtimes?theaterId=${showtimeData.theaterId}`)
        .then((res) => setExistingShowtimes(res.data))
        .catch((err) => console.error("Error fetching showtimes:", err));
    }
  }, [show, showtimeData.theaterId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "movieId" || name === "theaterId" || name === "price" ? parseInt(value, 10) : value;
    setShowtimeData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const isFormInvalid = Object.values(showtimeData).some((value) => value === "" || value === 0);

  const validateNoOverlap = (): boolean => {
    if (!movieDuration || !showtimeData.startTime || !showtime) return true;

    const newStart = new Date(showtimeData.startTime).getTime();
    const newEnd = newStart + movieDuration * 60000;

    return !existingShowtimes.some((existing) => {
      if (existing.id === showtime.id) return false;
      const existingStart = new Date(existing.startTime).getTime();
      const existingEnd = existingStart + existing.movie.duration * 60000;

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  const handleSubmit = () => {
    if (isFormInvalid) {
      alert("❌ All fields must be filled before updating.");
      return;
    }

    if (movieDuration === null) {
      alert("⏳ Please wait for the movie duration to load.");
      return;
    }

    const isOverlapping = validateNoOverlap();
    if (!isOverlapping) {
      alert("❌ This theater is unavailable, because it already shows a movie at this time.");
      return;
    }

    handleUpdate({
      id: showtime?.id || 0,
      movieId: showtimeData.movieId,
      theaterId: showtimeData.theaterId,
      startTime: showtimeData.startTime,
      price: showtimeData.price,
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
                  <option value="">Select a movie</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Theater</label>
                <select className="form-control" name="theaterId" value={showtimeData.theaterId} onChange={handleChange}>
                  <option value="">Select a theater</option>
                  {theaters.map((theater) => (
                    <option key={theater.id} value={theater.id}>{theater.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startTime"
                  value={showtimeData.startTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={showtimeData.price}
                  onChange={handleChange}
                />
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
