import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/movies/MoviesPage';
import ShowtimesPage from './pages/showtimes/ShowTimePage';
import TheatersPage  from './pages/theaters/TheatersPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/showtimes" element={<ShowtimesPage />} />
        <Route path="/theaters" element={<TheatersPage />} />
      </Routes>
    </Router>
  );
};

export default App;
