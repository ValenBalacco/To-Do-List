import styles from "./TareaSprintCard.module.css";
import { ITarea } from "../../../types/ITarea";

interface TareaSprintCardProps {
  tarea: ITarea;
  handleChangeEstado: (idTarea: string, nuevoEstado: string) => void;
  handleOpenModalEdit: (tarea: ITarea) => void; // Nueva función para editar
}

export const TareaSprintCard = ({
  tarea,
  handleChangeEstado,
  handleOpenModalEdit,
}: TareaSprintCardProps) => {
  const estados = ["pendiente", "en_proceso", "finalizada"];

  return (
    <div className={styles.card}>
      <h3>{tarea.titulo}</h3>
      <p>{tarea.descripcion}</p>
      <select
        value={tarea.estado}
        onChange={(e) => handleChangeEstado(tarea.id, e.target.value)}
      >
        {estados.map((estado) => (
          <option key={estado} value={estado}>
            {estado}
          </option>
        ))}
      </select>
      <button onClick={() => handleOpenModalEdit(tarea)}>Editar</button>
    </div>
  );
};
