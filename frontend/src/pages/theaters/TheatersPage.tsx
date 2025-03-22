import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/theaters/TheatersPage.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import AddTheaterModal from "./AddTheaterModal";
import EditTheaterModal from "./EditTheaterModal";
import ConfirmModal from "../general/ConfirmModal";

const TheatersPage: React.FC = () => {
  const [theaters, setTheaters] = useState<{ id: number; name: string; numberOfRows: number; numberOfColumns: number }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState<any>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [theaterToDelete, setTheaterToDelete] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/theaters`)
      .then(response => setTheaters(response.data))
      .catch(error => console.error("Error fetching theaters:", error));
  }, []);

  const handleEdit = (theater: any) => {
    setSelectedTheater(theater);
    setShowEditModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setTheaterToDelete(id);
    setConfirmModalVisible(true);
  };

  const confirmDelete = () => {
    if (theaterToDelete !== null) {
      axios.delete(`${process.env.REACT_APP_API_BASE_URL}/theaters/${theaterToDelete}`)
        .then(() => {
          setTheaters(theaters.filter(theater => theater.id !== theaterToDelete));
        })
        .catch(error => console.error("Error deleting theater:", error))
        .finally(() => {
          setConfirmModalVisible(false);
          setTheaterToDelete(null);
        });
    }
  };

  const handleUpdateTheater = (updatedTheater: any) => {
    axios.put(`${process.env.REACT_APP_API_BASE_URL}/theaters/${updatedTheater.id}`, updatedTheater)
      .then(() => {
        setTheaters(theaters.map((t) => (t.id === updatedTheater.id ? updatedTheater : t)));
        setShowEditModal(false);
      })
      .catch(error => console.error("Error updating theater:", error));
  };

  const handleAddTheater = (newTheater: any) => {
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/theaters`, newTheater)
      .then((response) => {
        setTheaters([...theaters, response.data]);
        setShowModal(false);
      })
      .catch(error => console.error("Error adding theater:", error));
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="theaters-container">
      {(showModal || showEditModal || confirmModalVisible) && <div className="page-overlay"></div>}
      <div className="back-btn-container">
        <button className="menu-btn" onClick={() => setShowModal(true)}>Add Theater ➕</button>
        <button className="menu-btn" onClick={handleBack}>Back ➡️</button>
      </div>
      <div className="theaters-content">
        <h1 className="theaters-title">Theaters 🎦</h1>
        <TableContainer className="theaters-table" component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Rows</strong></TableCell>
                <TableCell><strong>Columns</strong></TableCell>
                <TableCell align="right"><strong>Edit</strong></TableCell>
                <TableCell align="right"><strong>Delete</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {theaters.map((theater) => (
                <TableRow key={theater.id}>
                  <TableCell>{theater.name}</TableCell>
                  <TableCell>{theater.numberOfRows}</TableCell>
                  <TableCell>{theater.numberOfColumns}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <button className="edit-btn" onClick={() => handleEdit(theater)}>✏️</button>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete">
                      <button className="delete-btn" onClick={() => handleDeleteClick(theater.id)}>🗑️</button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <AddTheaterModal show={showModal} handleClose={() => setShowModal(false)} handleSave={handleAddTheater} />
        <EditTheaterModal show={showEditModal} handleClose={() => setShowEditModal(false)} handleUpdate={handleUpdateTheater} theater={selectedTheater} />

        {/* ✅ Confirm Modal Component */}
        <ConfirmModal
          show={confirmModalVisible}
          message={
            <>
              Are you sure you want to delete this theater?
              <br />
              <strong>⚠️ Deleting this theater will remove all showtimes associated with it.</strong>
            </>
          }
          onConfirm={confirmDelete}
          onCancel={() => setConfirmModalVisible(false)}
        />
      </div>
    </div>
  );
};

export default TheatersPage;
