import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/movies`)
      .then(response => setMovies(response.data))
      .catch(error => console.error('Error fetching movies:', error));


  }, []);

  return (
    <div>
      <h1>Movies List 🎥</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MoviesPage;
