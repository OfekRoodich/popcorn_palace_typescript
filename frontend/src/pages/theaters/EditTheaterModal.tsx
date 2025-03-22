import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/theaters/EditTheaterModal.css";

interface EditTheaterModalProps {
  show: boolean;
  handleClose: () => void;
  handleUpdate: (theater: { id: number; name: string; numberOfRows: number; numberOfColumns: number }) => void;
  theater: { id: number; name: string; numberOfRows: number; numberOfColumns: number } | null;
}

const EditTheaterModal: React.FC<EditTheaterModalProps> = ({ show, handleClose, handleUpdate, theater }) => {
  const [theaterData, setTheaterData] = useState({
    id: 0,
    name: "",
    numberOfRows: 0,
    numberOfColumns: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (show && theater) {
      setTheaterData({
        id: theater.id,
        name: theater.name,
        numberOfRows: theater.numberOfRows,
        numberOfColumns: theater.numberOfColumns,
      });
      setErrorMessage("");
      setShowAlert(true); // ✅ show alert on modal open
    }
  }, [show, theater]);

  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [showAlert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTheaterData((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Math.max(0, parseInt(value, 10) || 0),
    }));

    setErrorMessage("");
  };

  const handleSubmit = () => {
    if (!theaterData.name.trim()) {
      setErrorMessage("❌ Theater name can't be empty");
      return;
    }
    if (theaterData.numberOfRows <= 0 || theaterData.numberOfColumns <= 0) {
      setErrorMessage("❌ Number of rows and columns must be greater than zero");
      return;
    }

    handleUpdate({
      id: theaterData.id,
      name: theaterData.name.trim(),
      numberOfRows: theaterData.numberOfRows,
      numberOfColumns: theaterData.numberOfColumns,
    });

    handleClose();
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Theater</h5>
          </div>
          <div className="modal-body">
            {showAlert && (
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>⚠️ Warning:</strong> Editing this row or columns will be relevant to new showtimes only!
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAlert(false)}
                  aria-label="Close"
                ></button>
              </div>
            )}

            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={theaterData.name}
              onChange={handleChange}
            />

            <label>Rows</label>
            <input
              type="number"
              className="form-control"
              name="numberOfRows"
              value={theaterData.numberOfRows}
              onChange={handleChange}
              min="1"
            />

            <label>Columns</label>
            <input
              type="number"
              className="form-control"
              name="numberOfColumns"
              value={theaterData.numberOfColumns}
              onChange={handleChange}
              min="1"
            />

            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          <div className="modal-footer">
            <button className="cancel-btn" onClick={handleClose}>Cancel ❌</button>
            <button className="save-btn" onClick={handleSubmit}>Update ✅</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTheaterModal;
