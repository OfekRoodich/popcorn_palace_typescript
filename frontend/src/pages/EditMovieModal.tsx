import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/EditMovieModal.css";

interface EditMovieModalProps {
  show: boolean;
  handleClose: () => void;
  handleUpdate: (updatedMovie: { id: number; title: string; genre: string; duration: number; rating: number; releaseYear: number }) => void;
  movie: { id: number; title: string; genre: string; duration: number; rating: number; releaseYear: number } | null;
}

const EditMovieModal: React.FC<EditMovieModalProps> = ({ show, handleClose, handleUpdate, movie }) => {
  const [movieData, setMovieData] = useState({
    title: "",
    genre: "",
    duration: "",
    rating: "",
    releaseYear: "",
  });

  // Fill existing movie details when the modal opens
  useEffect(() => {
    if (movie) {
      setMovieData({
        title: movie.title,
        genre: movie.genre,
        duration: movie.duration.toString(),
        rating: movie.rating.toString(),
        releaseYear: movie.releaseYear.toString(),
      });
    }
  }, [movie, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormInvalid = Object.values(movieData).some((value) => value === "");

  const handleSubmit = () => {
    if (isFormInvalid) {
      alert("❌ All fields must be filled before saving.");
      return;
    }

    handleUpdate({
      id: movie?.id || 0,
      title: movieData.title,
      genre: movieData.genre,
      duration: parseInt(movieData.duration, 10),
      rating: parseFloat(movieData.rating),
      releaseYear: parseInt(movieData.releaseYear, 10),
    });

    handleClose(); // Close modal after updating
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Movie</h5>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-control" name="title" value={movieData.title} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input type="text" className="form-control" name="genre" value={movieData.genre} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input type="number" className="form-control" name="duration" value={movieData.duration} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <input type="number" step="0.1" className="form-control" name="rating" value={movieData.rating} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Release Year</label>
                <input type="number" className="form-control" name="releaseYear" value={movieData.releaseYear} onChange={handleChange} />
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

export default EditMovieModal;
