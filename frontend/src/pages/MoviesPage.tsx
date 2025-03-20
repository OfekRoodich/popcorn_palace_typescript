import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MoviesPage.css'; 
import Tooltip from '@mui/material/Tooltip'; 
import { useNavigate } from 'react-router-dom';


const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<{ id: number; title: string; genre: string; duration: number; rating: number; releaseYear: number }[]>([]);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/movies`)
      .then(response => setMovies(response.data))
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  const handleBack = () => {
    navigate('/'); // Navigate to Home Page
  };

  // Handle delete movie with confirmation popup
  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this movie?");
    if (isConfirmed) {
      axios.delete(`${process.env.REACT_APP_API_BASE_URL}/movies/${id}`)
        .then(() => {
          setMovies(movies.filter(movie => movie.id !== id));
        })
        .catch(error => console.error('Error deleting movie:', error));
    }
  };

  // Handle edit movie (extend with form if needed)
  const handleEdit = (id: number) => {
    console.log(`Edit movie with ID: ${id}`);
    // Implement edit logic here
  };

  return (
    <div className='movie-container'>

    <div className="buttons-container">
        <div className="back-btn-container">
            <button className="menu-btn">Add a Movie➕</button>
            <button className="menu-btn" onClick={handleBack}>Back ➡️</button>
        </div>

      <h1 className="movies-title">Now in theaters 🎥</h1>
      <div className="movies-row">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <div className="movie-card-header">
            <Tooltip title={<span>Edit</span>}>
              <button className="edit-btn" onClick={() => handleEdit(movie.id)}>✏️</button>
            </Tooltip>
            <Tooltip title={<span>Delete</span>}>
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
    </div>
    </div>

  );
};

export default MoviesPage;
