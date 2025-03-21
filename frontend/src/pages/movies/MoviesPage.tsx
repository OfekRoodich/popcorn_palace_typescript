import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/movies/MoviesPage.css";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import AddMovieModal from "./AddMovieModal";
import EditMovieModal from "./EditMovieModal"; 

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<
    { id: number; title: string; genre: string; duration: number; rating: number; releaseYear: number }[]
  >([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null); // Track movie being edited
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/movies`)
      .then((response) => setMovies(response.data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const handleBack = () => {
    navigate("/");
  };

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this movie?");
    if (isConfirmed) {
      axios
        .delete(`${process.env.REACT_APP_API_BASE_URL}/movies/${id}`)
        .then(() => {
          setMovies(movies.filter((movie) => movie.id !== id));
        })
        .catch((error) => console.error("Error deleting movie:", error));
    }
  };

  const handleEdit = (movie: any) => {
    setSelectedMovie(movie);
    setShowEditModal(true);
  };

  const handleUpdateMovie = (updatedMovie: any) => {
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/movies/${updatedMovie.id}`, updatedMovie)
      .then(() => {
        setMovies(movies.map((movie) => (movie.id === updatedMovie.id ? updatedMovie : movie)));
        setShowEditModal(false);
      })
      .catch((error) => console.error("Error updating movie:", error));
  };

  const handleAddMovie = (newMovie: any) => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/movies`, newMovie)
      .then((response) => {
        setMovies([...movies, response.data]);
        setShowAddModal(false);
      })
      .catch((error) => console.error("Error adding movie:", error));
  };

  return (
    <div className="movie-container">
  {(showAddModal || showEditModal) && <div className="page-overlay"></div>}  
  
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
            <button className="delete-btn" onClick={() => handleDelete(movie.id)}>🗑️</button>
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

      <AddMovieModal show={showAddModal} handleClose={() => setShowAddModal(false)} handleSave={handleAddMovie} />

      <EditMovieModal 
        show={showEditModal} 
        handleClose={() => setShowEditModal(false)} 
        handleUpdate={handleUpdateMovie} 
        movie={selectedMovie} 
      />
    </div>
  );
};

export default MoviesPage;
