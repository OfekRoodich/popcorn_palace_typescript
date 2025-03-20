import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Ensure CSS is imported


const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <div className="content">
        <h1 className="headline">Popcorn Palace 🍿🏰<span ></span></h1>
        <div className="overlay">
          <nav>
            <ul className="nav-links">
            <li><Link to="/movies" className="btn btn-info">Movies 🎥</Link></li>
            <li><Link to="/showtimes" className="btn btn-success">Showtimes 🕒</Link></li>
            <li><Link to="/booking" className="btn btn-danger btn-lg">Book a Ticket 🎟️ </Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
