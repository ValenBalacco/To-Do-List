import { useEffect, useState } from "react";
import { useTareas } from "../../../hooks/useTareas";
import styles from "./Sprints.module.css";
import { TareaSprintCard } from "../../ui/TareaSprintCard/TareaSprintCard";
import { ModalCrearTarea } from "../../ui/modalCrearTarea/modalCrearTarea";
import { ITarea } from "../../../types/ITarea";

interface SprintsProps {
  sprintId: string;
  sprintName: string;
}

export const Sprints = ({ sprintId, sprintName }: SprintsProps) => {
  const { getTareasSprint, cambiarEstadoTarea, createTarea } = useTareas();
  const [tareasFiltradas, setTareasFiltradas] = useState<ITarea[]>([]);

  useEffect(() => {
    const tareas = getTareasSprint(sprintId); // Filtramos las tareas para este sprint
    setTareasFiltradas(tareas);
  }, [sprintId, getTareasSprint]);

  const [openModalTarea, setOpenModalTarea] = useState(false);

  const handleOpenModalCreate = () => {
    setOpenModalTarea(true);
  };

  const handleCloseModal = () => {
    setOpenModalTarea(false);
  };

  const handleSaveTarea = (tarea: ITarea) => {
    createTarea({ ...tarea, estado: "pendiente", sprintId }); // Creamos la tarea asociada al sprint actual
    setTareasFiltradas((prev) => [...prev, { ...tarea, estado: "pendiente", sprintId }]);
    setOpenModalTarea(false);
  };

  const handleChangeEstado = (idTarea: string, nuevoEstado: string) => {
    cambiarEstadoTarea(idTarea, nuevoEstado); // Cambiamos el estado de la tarea
    setTareasFiltradas((prev) =>
      prev.map((tarea) =>
        tarea.id === idTarea ? { ...tarea, estado: nuevoEstado } : tarea
      )
    );
  };

  const pendientes = tareasFiltradas.filter((tarea) => tarea.estado === "pendiente");
  const enProceso = tareasFiltradas.filter((tarea) => tarea.estado === "en_proceso");
  const finalizadas = tareasFiltradas.filter((tarea) => tarea.estado === "finalizada");

  return (
    <div className={styles.containerSprints}>
      <h1>{sprintName}</h1>
      <button
        className={styles.crearTareaButton}
        onClick={handleOpenModalCreate}
      >
        Crear Tarea
      </button>
      <div className={styles.column}>
        <h2>Tareas Pendientes</h2>
        {pendientes.map((tarea) => (
          <TareaSprintCard
            key={tarea.id}
            tarea={tarea}
            handleChangeEstado={handleChangeEstado}
          />
        ))}
      </div>
      <div className={styles.column}>
        <h2>Tareas en Proceso</h2>
        {enProceso.map((tarea) => (
          <TareaSprintCard
            key={tarea.id}
            tarea={tarea}
            handleChangeEstado={handleChangeEstado}
          />
        ))}
      </div>
      <div className={styles.column}>
        <h2>Tareas Finalizadas</h2>
        {finalizadas.map((tarea) => (
          <TareaSprintCard
            key={tarea.id}
            tarea={tarea}
            handleChangeEstado={handleChangeEstado}
          />
        ))}
      </div>
      {openModalTarea && (
        <ModalCrearTarea
          handleCloseModal={handleCloseModal}
          handleSaveTarea={handleSaveTarea}
        />
      )}
    </div>
  );
};
