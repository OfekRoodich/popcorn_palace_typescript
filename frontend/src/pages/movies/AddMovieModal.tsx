import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/movies/AddMovieModal.css";

interface AddMovieModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (movie: {
    title: string;
    genre: string;
    duration: number;
    rating: number;
    releaseYear: number;
  }) => void;
  errorMessage?: string;
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({
  show,
  handleClose,
  handleSave,
  errorMessage,
}) => {
  const [movieData, setMovieData] = useState({
    title: "",
    genre: "",
    duration: "",
    rating: "",
    releaseYear: "",
  });


  useEffect(() => {
    if (!show) {
      setMovieData({ title: "", genre: "", duration: "", rating: "", releaseYear: "" });
    }
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormInvalid = Object.values(movieData).some((value) => value === "");

  const handleSubmit = () => {

    handleSave({
      title: movieData.title,
      genre: movieData.genre,
      duration: parseInt(movieData.duration, 10),
      rating: parseFloat(movieData.rating),
      releaseYear: parseInt(movieData.releaseYear, 10),
    });
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Add a New Movie</h5>
          </div>
          {errorMessage && (<div className="alert alert-danger mt-3" role="alert">{errorMessage}</div>)}
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

export default AddMovieModal;
