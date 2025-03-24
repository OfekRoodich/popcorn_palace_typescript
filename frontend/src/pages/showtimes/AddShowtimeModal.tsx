import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/showtimes/AddShowtimeModal.css";
import axios from "axios";

interface AddShowtimeModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (showtime: { movieId: number; theaterId: number; startTime: string; price: number }) => void;
  errorMessage?: string;
}

const AddShowtimeModal: React.FC<AddShowtimeModalProps> = ({ show, handleClose, handleSave, errorMessage }) => {
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [theaters, setTheaters] = useState<{ id: number; name: string }[]>([]);
  const [existingShowtimes, setExistingShowtimes] = useState<
    { startTime: string; movie: { duration: number }; theaterId: number }[]
  >([]);
  const [movieDuration, setMovieDuration] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const [showtimeData, setShowtimeData] = useState({
    movieId: 0,
    theaterId: 0,
    startTime: "",
    price: 0,
  });

  useEffect(() => {
    if (showtimeData.movieId) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/movies/${showtimeData.movieId}`)
        .then((res) => setMovieDuration(res.data.duration))
        .catch((err) => console.error("Error fetching movie duration:", err));
    }
  }, [showtimeData.movieId]);

  useEffect(() => {
    if (showtimeData.startTime && movieDuration) {
      const start = new Date(showtimeData.startTime);
      const end = new Date(start.getTime() + movieDuration * 60000);
      setEndTime(end.toLocaleString());
    } else {
      setEndTime(null);
    }
  }, [showtimeData.startTime, movieDuration]);

  useEffect(() => {
    if (showtimeData.theaterId) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/showtimes?theaterId=${showtimeData.theaterId}`)
        .then((res) => setExistingShowtimes(res.data))
        .catch((err) => console.error("❌ Error fetching showtimes:", err));
    }
  }, [showtimeData.theaterId]);

  useEffect(() => {
    if (show) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/movies/all`)
        .then((response) => setMovies(response.data))
        .catch((error) => console.error("Error fetching movies:", error));

      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/theaters`)
        .then((response) => setTheaters(response.data))
        .catch((error) => console.error("Error fetching theaters:", error));
    } else {
      setShowtimeData({ movieId: 0, theaterId: 0, startTime: "", price: 0 });
      setMovieDuration(null);
      setEndTime(null);
      setExistingShowtimes([]);
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

    if (movieDuration === null) {
      alert("⏳ Please wait for the movie duration to load.");
      return;
    }



    handleSave({
      movieId: showtimeData.movieId,
      theaterId: showtimeData.theaterId,
      startTime: showtimeData.startTime,
      price: showtimeData.price,
    });
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add a New Showtime</h5>
          </div>
          {errorMessage && (
            <div className="alert alert-danger mt-2" role="alert">
              {errorMessage}
            </div>
          )}
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
                <select className="form-control" name="theaterId" value={showtimeData.theaterId} onChange={handleChange}>
                  <option value="">Select a theater</option>
                  {theaters.map((theater) => (
                    <option key={theater.id} value={theater.id}>
                      {theater.name}
                    </option>
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
            <button className="cancel-btn" onClick={handleClose}>
              Cancel ❌
            </button>
            <button className="save-btn" onClick={handleSubmit} disabled={isFormInvalid}>
              Save ✅
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShowtimeModal;
