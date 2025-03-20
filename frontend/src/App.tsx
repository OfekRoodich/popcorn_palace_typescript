import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import ShowtimesPage from './pages/ShowTimePage';
import BookingPage from './pages/BookingPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/showtimes" element={<ShowtimesPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
