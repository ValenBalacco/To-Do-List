import { useState, useEffect } from "react";
import styles from "./ModalGestionarSprint.module.css";

interface Sprint {
  id: string;
  name: string;
}

interface ModalGestionarSprintProps {
  sprint?: Sprint | null;
  handleCloseModal: () => void;
  handleSaveSprint: (sprint: Sprint) => void;
}

export const ModalGestionarSprint = ({
  sprint,
  handleCloseModal,
  handleSaveSprint,
}: ModalGestionarSprintProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (sprint) {
      setName(sprint.name);
    } else {
      setName("");
    }
  }, [sprint]);

  const handleSubmit = () => {
    if (name.trim() === "") return;
    handleSaveSprint({ id: sprint?.id || "", name });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{sprint ? "Editar Sprint" : "Crear Sprint"}</h2>
        <input
          type="text"
          placeholder="Nombre del Sprint"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <button onClick={handleSubmit}>
            {sprint ? "Guardar Cambios" : "Crear Sprint"}
          </button>
          <button onClick={handleCloseModal} className={styles.closeButton}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
