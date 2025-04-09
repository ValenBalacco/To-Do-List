import React, { useState, useEffect } from "react";
import styles from "./ModalGestionarSprint.module.css";
import Swal from "sweetalert2";

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface ModalGestionarSprintProps {
  sprint: Sprint | null;
  handleCloseModal: () => void;
  handleSaveSprint: (sprint: Sprint) => void;
}

export const ModalGestionarSprint: React.FC<ModalGestionarSprintProps> = ({
  sprint,
  handleCloseModal,
  handleSaveSprint,
}) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Populate fields when editing an existing sprint
  useEffect(() => {
    if (sprint) {
      setName(sprint.name);
      setStartDate(sprint.startDate);
      setEndDate(sprint.endDate);
    } else {
      setName("");
      setStartDate("");
      setEndDate("");
    }
  }, [sprint]);

  const handleSave = () => {
    if (!name.trim() || !startDate.trim() || !endDate.trim()) {
      Swal.fire("Error", "Todos los campos son obligatorios.", "error");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      Swal.fire("Error", "La fecha de inicio no puede ser mayor que la fecha de cierre.", "error");
      return;
    }

    handleSaveSprint({
      id: sprint?.id || Date.now().toString(),
      name,
      startDate,
      endDate,
    });
    handleCloseModal(); // Cierra el modal después de guardar
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{sprint ? "Editar Sprint" : "Crear Sprint"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del Sprint"
            className="form-control mb-3"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Fecha de Inicio"
            className="form-control mb-3"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Fecha Límite"
            className="form-control mb-3"
          />
          <div className={styles.modalActions}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
