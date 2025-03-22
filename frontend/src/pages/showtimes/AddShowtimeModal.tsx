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

const AddShowtimeModal: React.FC<AddShowtimeModalProps> = ({ show, handleClose, handleSave,errorMessage }) => {
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [theaters, setTheaters] = useState<{ id: number; name: string }[]>([]);
  const [existingShowtimes, setExistingShowtimes] = useState<
  { startTime: string; movie: { duration: number }; theaterId:number }[]
>([]);  const [movieDuration, setMovieDuration] = useState<number | null>(null);

  const [showtimeData, setShowtimeData] = useState({
    movieId: 0,
    theaterId: 0,
    startTime: "",
    price: 0,
  });

  useEffect(() => {
    if (showtimeData.movieId) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/movies/${showtimeData.movieId}`)
        .then((res) => {
          console.log("🎬 Selected Movie Data:", res.data); // Debugging
          setMovieDuration(res.data.duration); // Store the duration for validation
        })
        .catch((err) => console.error("Error fetching movie duration:", err));
    }
  }, [showtimeData.movieId]);

  useEffect(() => {
    if (showtimeData.theaterId) {
      console.log("🔵 Fetching showtimes for theaterId:", showtimeData.theaterId);
      
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/showtimes?theaterId=${showtimeData.theaterId}`)
        .then((res) => {
          console.log("✅ Received showtimes:", res.data);
          setExistingShowtimes(res.data);
        })
        .catch((err) => console.error("❌ Error fetching showtimes:", err));
    }
  }, [showtimeData.theaterId]);

  useEffect(() => {
    if (show) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/movies`)
        .then((response) => setMovies(response.data))
        .catch((error) => console.error("Error fetching movies:", error));

      axios.get(`${process.env.REACT_APP_API_BASE_URL}/theaters`)
        .then((response) => setTheaters(response.data))
        .catch((error) => console.error("Error fetching theaters:", error));
    }
    else
      setShowtimeData({ movieId: 0, theaterId: 0, startTime: "", price: 0 });

  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShowtimeData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormInvalid = Object.values(showtimeData).some((value) => value === "");

  const validateNoOverlap = (): boolean => {
  if (!movieDuration || !showtimeData.startTime) {
    return true; 
  }

  const newStart = new Date(showtimeData.startTime).getTime();
  const newEnd = new Date(newStart + movieDuration * 60000).getTime(); // Use the selected movie's duration

  console.log("🟢 New Show Start:", newStart, "End:", newEnd);
  
  let count=1;
  return !existingShowtimes.some((show) => {

    const existingStart = new Date(show.startTime).getTime(); // ✅ Convert to Date first
    const existingEnd = new Date(existingStart + show.movie.duration * 60000).getTime(); // ✅ Add duration properly

    return ( (newStart>=existingStart && newStart<=existingEnd) || (newEnd>=existingStart && newEnd<=existingEnd) || 
  (newStart<=existingStart && newEnd>=existingEnd))});
};

  

  const handleSubmit = () => {
    if (isFormInvalid) {
      alert("❌ All fields must be filled before saving.");
      return;
    }

    if (movieDuration === null) {
      alert("⏳ Please wait for the movie duration to load.");
      return;
    }
    const isOverlapping = validateNoOverlap();
    if (!isOverlapping) {
      alert("❌ This theater is unavaileble, because it already shows a movie at this times");
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
          {errorMessage && (<div className="alert alert-danger mt-2" role="alert">{errorMessage}</div>)}
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
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startTime"
                  value={showtimeData.startTime}
                  onChange={handleChange}
                />
              </div>

              {/* Price */}
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
