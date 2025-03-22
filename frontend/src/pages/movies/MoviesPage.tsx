import React, { useEffect, useState } from "react";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import AddMovieModal from "./AddMovieModal";
import EditMovieModal from "./EditMovieModal";
import ConfirmModal from "../general/ConfirmModal"; 
import "../../styles/movies/MoviesPage.css";
import "../../styles/general/GeneralPage.css";

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<
    { id: number; title: string; genre: string; duration: number; rating: number; releaseYear: number }[]
  >([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [editError, setEditError] = useState("");
  const [addError, setAddError] = useState("");

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/movies`)
      .then((response) => setMovies(response.data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const handleBack = () => navigate("/");

  const confirmDelete = (id: number) => {
    setMovieToDelete(id);
    setConfirmVisible(true);
  };

  const handleConfirmDelete = () => {
    if (movieToDelete !== null) {
      axios
        .delete(`${process.env.REACT_APP_API_BASE_URL}/movies/${movieToDelete}`)
        .then(() => {
          setMovies(movies.filter((movie) => movie.id !== movieToDelete));
          setConfirmVisible(false);
        })
        .catch((error) => {
          console.error("Error deleting movie:", error);
          setConfirmVisible(false);
        });
    }
  };

  const handleEdit = (movie: any) => {
    setSelectedMovie(movie);
    setShowEditModal(true);
  };

  const handleUpdateMovie = async (updatedMovie: any) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/movies/${updatedMovie.id}`, updatedMovie);
      setMovies(movies.map((movie) => (movie.id === updatedMovie.id ? updatedMovie : movie)));
      setShowEditModal(false);
      setEditError("");
    } catch (error: any) {
      const message = error.response?.data?.message || "❌ Failed to update movie.";
      setEditError(message);
    }
  };

  const handleAddMovie = async (newMovie: any) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/movies`, newMovie);
      setMovies([...movies, response.data]);
      setShowAddModal(false);
      setAddError("");
    } catch (error: any) {
      const message = error.response?.data?.message || "❌ Failed to add movie.";
      setAddError(message);
    }
  };

  return (
    <div className="movie-container">
      {(showAddModal || showEditModal || confirmVisible) && <div className="page-overlay"></div>}

      <div className="buttons-container">
        <div className="back-btn-container">
          <button className="menu-btn" onClick={() => setShowAddModal(true)}>Add a Movie➕</button>
          <button className="menu-btn" onClick={handleBack}>Back ➡️</button>
        </div>
      </div>

      <h1 className="movies-title">Now in theaters 🎥</h1>
      <div className="movies-row">
        {movies.sort((a, b) => a.title.localeCompare(b.title)).map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="movie-card-header">
              <Tooltip title="Edit">
                <button className="edit-btn" onClick={() => handleEdit(movie)}>✏️</button>
              </Tooltip>
              <Tooltip title="Delete">
                <button className="delete-btn" onClick={() => confirmDelete(movie.id)}>🗑️</button>
              </Tooltip>
            </div>
            <div className="card-body">
              <h5 className="movie-card-title">{movie.title}</h5>
              <p className="movie-card-text"><strong>Genre:</strong> {movie.genre}</p>
              <p className="movie-card-text"><strong>Duration:</strong> {movie.duration} min</p>
              <p className="movie-card-text"><strong>Rating:</strong> {movie.rating} ⭐</p>
              <p className="movie-card-text"><strong>Year:</strong> {movie.releaseYear}</p>
            </div>
          </div>
        ))}
      </div>

      <AddMovieModal
        show={showAddModal}
        handleClose={() => {
          setShowAddModal(false);
          setAddError("");
        }}
        handleSave={handleAddMovie}
        errorMessage={addError}
      />

      <EditMovieModal
        show={showEditModal}
        handleClose={() => {
          setShowEditModal(false);
          setEditError("");
        }}
        handleUpdate={handleUpdateMovie}
        movie={selectedMovie}
        errorMessage={editError}
      />

      <ConfirmModal
        show={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleConfirmDelete}
        message={
          <>
            Are you sure you want to delete this movie?
            <br />
            <strong>⚠️ Deleting this movie will remove all showtimes associated with it.</strong>
          </>
        }
      />
    </div>
  );
};

export default MoviesPage;
