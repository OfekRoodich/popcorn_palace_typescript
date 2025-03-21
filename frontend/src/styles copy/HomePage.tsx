import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <div className="overlay">
        <h1 className="title">Welcome to Popcorn Palace 🎬</h1>
        <nav>
          <ul className="nav-links">
            <li><Link to="/movies">🎥 Movies</Link></li>
            <li><Link to="/showtimes">🕒 Showtimes</Link></li>
            <li><Link to="/theaters">Theaters 🎦</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default HomePage;
