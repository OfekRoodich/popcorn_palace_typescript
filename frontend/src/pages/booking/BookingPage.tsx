// src/components/booking/BookingPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/booking/BookingPage.css";
import "../../styles/general/GeneralPage.css";


const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showtime, setShowtime] = useState<any>(null);
  const [seatMatrix, setSeatMatrix] = useState<number[][]>([]);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ success alert
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/showtimes/${id}`)
        .then((res) => {
          const showtime = res.data;
          setShowtime(showtime);
          setSeatMatrix(showtime.seatMatrix);
        })
        .catch((err) => console.error("Error fetching showtime:", err));
    }
  }, [id]);

  const toggleSeat = (row: number, col: number) => {
    setSeatMatrix(prevMatrix => {
      const updated = prevMatrix.map(r => [...r]); // deep copy
      const current = updated[row][col];

      if (current === 0) {
        updated[row][col] = 1; // select
      } else if (current === 1) {
        updated[row][col] = 0; // unselect
      }

      return updated;
    });
  };

  const handleOrder = () => {
    const updatedMatrix = seatMatrix.map(row =>
      row.map(seat => (seat === 1 ? 2 : seat))
    );

    setSeatMatrix(updatedMatrix);

    axios.put(`${process.env.REACT_APP_API_BASE_URL}/showtimes/${id}/seats`, {
      seatMatrix: updatedMatrix
    })
    .then(() => {
      setShowSuccess(true); // ✅ show success alert
      setTimeout(() => {
        setShowSuccess(false);
        handleBack();
      }, 2500);
    })
    .catch(err => console.error("Booking failed:", err));
  };

  const handleBack = () => {
    navigate("/showtimes");
  };

  if (!showtime || !showtime.theater) return <div>Loading...</div>;

  return (
    <div className="booking-container">
      <div className="booking-back-btn-container">
        <button className="menu-btn" onClick={handleBack}>Back ➡️</button>
      </div>

      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
          ✅ Tickets booked successfully!
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowSuccess(false)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <h2>
        Booking for: <strong>{showtime.movie?.title}</strong>
      </h2>
      <p>
        Showtime: {new Date(showtime.startTime).toLocaleString()}
      </p>

      <div className="seats-grid">
        <div className="screen-trapezoid">SCREEN</div>
        {seatMatrix.map((row, rowIndex) => (
          <div className="seat-row" key={rowIndex}>
            <div className="row-label">{rowIndex + 1}</div>
            {row.map((seat, colIndex) => (
              <div
                className={`seat ${seat === 0 ? "available" : seat === 1 ? "selected" : "taken"}`}
                key={`${rowIndex}-${colIndex}`}
                onClick={() => toggleSeat(rowIndex, colIndex)}
              >
                {colIndex + 1}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="oreder-contianer">
        <button
          className="order-btn"
          onClick={handleOrder}
          disabled={!seatMatrix.some(row => row.includes(1))}
        >
          Order
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
