import { useEffect, useState } from "react";
import { useTareas } from "../../../hooks/useTareas";
import styles from "./Backlog.module.css";
import { TareaBacklogCard } from "../../ui/TareaBacklogCard/TareaBacklogCard";
import { ITarea } from "../../../types/ITarea";
import { ModalCrearTarea } from "../../ui/modalCrearTarea/modalCrearTarea";
import Swal from "sweetalert2";

export const Backlog = () => {
  const { getTareas, tareas, eliminarTarea, moverTareaASprint, createTarea, putTareaEditar } = useTareas();
  const [sprints, setSprints] = useState<{ id: string; name: string }[]>(() => {
    const savedSprints = localStorage.getItem("sprints");
    return savedSprints ? JSON.parse(savedSprints) : [];
  });

  useEffect(() => {
    getTareas();
  }, []);

  const [openModalTarea, setOpenModalTarea] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<ITarea | null>(null);

  const handleOpenModalCreate = () => {
    setTareaEditando(null); // Limpiamos la tarea en edición
    setOpenModalTarea(true);
  };

  const handleOpenModalEdit = (tarea: ITarea) => {
    setTareaEditando(tarea); // Establecemos la tarea en edición
    setOpenModalTarea(true);
  };

  const handleCloseModal = () => {
    setOpenModalTarea(false);
  };

  const handleSaveTarea = (tarea: ITarea) => {
    if (tareaEditando) {
      putTareaEditar(tarea); // Editamos la tarea existente
    } else {
      createTarea({ ...tarea, sprintId: undefined }); // Creamos una nueva tarea sin sprintId
    }
    setOpenModalTarea(false);
  };

  const handleDeleteTarea = (idTarea: string) => {
    eliminarTarea(idTarea);
  };

  const handleMoveToSprint = (idTarea: string, sprintId: string) => {
    moverTareaASprint(idTarea, sprintId);
    const sprint = sprints.find((s) => s.id === sprintId);
    Swal.fire(
      "Tarea Movida",
      `La tarea ha sido movida al ${sprint?.name || "Sprint"}.`,
      "success"
    );
  };

  return (
    <>
      <div className={styles.containerBacklog}>
        <h1>Backlog</h1>
        <button className={styles.crearTareaButton} onClick={handleOpenModalCreate}>
          Crear Tarea
          <span className="material-symbols-outlined"></span>
        </button>

        {tareas?.length > 0 ? (
          tareas.map((el) => (
            <TareaBacklogCard
              key={el.id}
              tarea={el}
              handleOpenModalEdit={handleOpenModalEdit}
              handleDeleteTarea={handleDeleteTarea}
              handleMoveToSprint={handleMoveToSprint}
              sprints={sprints} // Pasamos la lista de sprints
            />
          ))
        ) : (
          <div>
            <h3>No hay Tareas</h3>
          </div>
        )}
      </div>
      {openModalTarea && (
        <ModalCrearTarea
          tarea={tareaEditando}
          handleCloseModal={handleCloseModal}
          handleSaveTarea={handleSaveTarea}
        />
      )}
    </>
  );
};