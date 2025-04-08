import React, { useState } from "react";
import styles from "./ModalGestionarSprint.module.css";

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
  const [name, setName] = useState(sprint?.name || "");
  const [startDate, setStartDate] = useState(sprint?.startDate || "");
  const [endDate, setEndDate] = useState(sprint?.endDate || "");

  const handleSave = () => {
    if (name.trim() && startDate.trim() && endDate.trim()) {
      handleSaveSprint({ id: sprint?.id || "", name, startDate, endDate });
    } else {
      alert("Todos los campos son obligatorios.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{sprint ? "Editar Sprint" : "Crear Sprint"}</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del Sprint"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Fecha de Inicio"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Fecha Límite"
        />
        <div className={styles.modalActions}>
          <button onClick={handleCloseModal}>Cancelar</button>
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};
