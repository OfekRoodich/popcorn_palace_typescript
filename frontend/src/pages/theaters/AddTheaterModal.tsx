import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/theaters/AddTheaterModal.css";

interface AddTheaterModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (theater: { name: string; numberOfRows: number; numberOfColumns: number }) => void;
  errorMessage?: string;
}

const AddTheaterModal: React.FC<AddTheaterModalProps> = ({ show, handleClose, handleSave, errorMessage }) => {
  const [theaterData, setTheaterData] = useState({
    name: "",
    numberOfRows: 0,
    numberOfColumns: 0,
  });

  useEffect(() => {
    if (!show) {
      setTheaterData({ name: "", numberOfRows:0, numberOfColumns:0 });
    }
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTheaterData((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Math.max(0, parseInt(value, 10) || 0), // Ensure numbers are non-negative
    }));

  };

  const handleSubmit = () => {
    handleSave({
      name: theaterData.name.trim(),
      numberOfRows: theaterData.numberOfRows,
      numberOfColumns: theaterData.numberOfColumns,
    });

  };


  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Theater</h5>
          </div>
          {errorMessage && (<div className="alert alert-danger mt-2" role="alert">{errorMessage}</div>)}
          <div className="modal-body">
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
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={handleClose}>Cancel ❌</button>
            <button className="save-btn" onClick={handleSubmit}>Save ✅</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTheaterModal;
