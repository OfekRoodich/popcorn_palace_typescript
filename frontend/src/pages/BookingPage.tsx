import React, { useState } from 'react';
import axios from 'axios';

const BookingPage: React.FC = () => {
  const [showtimeId, setShowtimeId] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [userId, setUserId] = useState('');

  const handleBooking = () => {
    axios.post('http://localhost:3001/bookings', {
      showtime: parseInt(showtimeId),
      seatNumber: parseInt(seatNumber),
      userId,
    })
    .then(() => alert('Booking successful! 🎟️'))
    .catch(error => alert(`Error: ${error.response?.data?.message || 'Failed to book'}`));
  };

  return (
    <div>
      <h1>Book a Ticket 🎟️</h1>
      <label>
        Showtime ID:
        <input type="number" value={showtimeId} onChange={(e) => setShowtimeId(e.target.value)} />
      </label>
      <br />
      <label>
        Seat Number:
        <input type="number" value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} />
      </label>
      <br />
      <label>
        User ID:
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      </label>
      <br />
      <button onClick={handleBooking}>Book Now</button>
    </div>
  );
};

export default BookingPage;
