import styles from "./TareaSprintCard.module.css";
import { ITarea } from "../../../types/ITarea";

interface TareaSprintCardProps {
  tarea: ITarea;
}

export const TareaSprintCard = ({ tarea }: TareaSprintCardProps) => {
  return (
    <div className={styles.card}>
      <h3>{tarea.titulo}</h3>
      <p>{tarea.descripcion}</p>
    </div>
  );
};
