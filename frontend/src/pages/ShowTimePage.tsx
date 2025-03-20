import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShowtimesPage: React.FC = () => {
  const [showtimes, setShowtimes] = useState<{ id: number; theater: string; startTime: string }[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/showtimes')
      .then(response => setShowtimes(response.data))
      .catch(error => console.error('Error fetching showtimes:', error));
  }, []);

  return (
    <div>
      <h1>Showtimes 🎭</h1>
      <ul>
        {showtimes.map(showtime => (
          <li key={showtime.id}>
            {showtime.theater} - {new Date(showtime.startTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowtimesPage;
