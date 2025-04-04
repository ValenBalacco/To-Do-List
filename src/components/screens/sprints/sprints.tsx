import { useEffect } from "react";
import { useTareas } from "../../../hooks/useTareas";
import styles from "./Sprints.module.css";
import { TareaSprintCard } from "../../ui/TareaSprintCard/TareaSprintCard";

export const Sprints = () => {
  const { getTareasSprint, tareasSprint } = useTareas();

  useEffect(() => {
    getTareasSprint(); // Obtenemos las tareas del sprint
  }, []);

  return (
    <div className={styles.containerSprints}>
      <h1>Sprints</h1>
      {
        tareasSprint?.length > 0 ? (
          tareasSprint.map((el) => (
            <TareaSprintCard key={el.id} tarea={el} />
          ))
        ) : (
          <div>
            <h3>No hay Tareas en el Sprint</h3>
          </div>
        )
      }
    </div>
  );
};
