import { useEffect, useState } from "react";
import { useTareas } from "../../../hooks/useTareas";
import { tareaStore } from "../../../store/tareaStore";
import styles from "./Backlog.module.css";
import { TareaBacklogCard } from "../../ui/TareaBacklogCard/TareaBacklogCard";
import { ITarea } from "../../../types/ITarea";
import { ModalCrearTarea } from "../../ui/modalCrearTarea/modalCrearTarea";

export const Backlog = () => {
  const setTareaActiva = tareaStore((state) => state.setTareaActiva);

  const { getTareas, tareas, eliminarTarea, moverTareaASprint } = useTareas(); // Añadimos moverTareaASprint
  useEffect(() => {
    getTareas();
  }, []);

  const [openModalTarea, setOpenModalTarea] = useState(false);

  const handleOpenModalEdit = (tarea: ITarea) => {
    setTareaActiva(tarea);
    setOpenModalTarea(true);
  };
  const handleCloseModal = () => {
    setOpenModalTarea(false);
  };
  const handleDeleteTarea = (idTarea: string) => {
    eliminarTarea(idTarea);
  };
  const handleMoveToSprint = (idTarea: string) => {
    moverTareaASprint(idTarea); // Lógica para mover tarea al sprint
  };

  return (
    <>
      <div className={styles.containerBacklog}>
        <h1>Backlog</h1>
        <button className={styles.crearTareaButton} onClick={() => setOpenModalTarea(true)}>
          Crear Tarea
          <span className={`material-symbols-outlined ${styles.backlogIcon}`}>
            playlist_add
          </span>
        </button>

        {
          tareas?.length > 0 ? (
            tareas.map((el) => (
              <TareaBacklogCard
                key={el.id}
                tarea={el}
                handleOpenModalEdit={handleOpenModalEdit}
                handleDeleteTarea={handleDeleteTarea}
                handleMoveToSprint={handleMoveToSprint} // Pasamos la función
              />
            ))
          ) : (
            <div>
              <h3>No hay Tareas</h3>
            </div>
          )
        }
      </div>
      {openModalTarea && <ModalCrearTarea handleCloseModal={handleCloseModal} />}
    </>
  );
};