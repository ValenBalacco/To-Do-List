import styles from "./TareaBacklogCard.module.css";
import { ITarea } from "../../../types/ITarea";

interface TareaBacklogCardProps {
  tarea: ITarea;
  handleOpenModalEdit: (tarea: ITarea) => void;
  handleDeleteTarea: (idTarea: string) => void;
  handleMoveToSprint: (idTarea: string) => void;
}

export const TareaBacklogCard = ({ tarea, handleOpenModalEdit, handleDeleteTarea, handleMoveToSprint }: TareaBacklogCardProps) => {
  return (
    <div className={styles.card}>
      <h3>{tarea.titulo}</h3>
      <p>{tarea.descripcion}</p>
      <button onClick={() => handleOpenModalEdit(tarea)}>Editar</button>
      <button onClick={() => tarea.id && handleDeleteTarea(tarea.id)}>Eliminar</button>
      <button onClick={() => tarea.id && handleMoveToSprint(tarea.id)}>Mover a Sprint</button>
    </div>
  );
};