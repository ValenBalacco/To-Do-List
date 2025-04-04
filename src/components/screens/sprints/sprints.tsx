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
  const { getTareasSprint, cambiarEstadoTarea, createTarea, putTareaEditar } = useTareas();
  const [tareasFiltradas, setTareasFiltradas] = useState<ITarea[]>([]);
  const [openModalTarea, setOpenModalTarea] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<ITarea | null>(null);

  useEffect(() => {
    const tareas = getTareasSprint(sprintId); // Filtramos las tareas para este sprint
    setTareasFiltradas(tareas);
  }, [sprintId, getTareasSprint]);

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
      setTareasFiltradas((prev) =>
        prev.map((t) => (t.id === tarea.id ? tarea : t))
      );
    } else {
      createTarea({ ...tarea, estado: "pendiente", sprintId }); // Creamos la tarea asociada al sprint actual
      setTareasFiltradas((prev) => [...prev, { ...tarea, estado: "pendiente", sprintId }]);
    }
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
            handleOpenModalEdit={handleOpenModalEdit} // Pasamos la función para editar
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
            handleOpenModalEdit={handleOpenModalEdit} // Pasamos la función para editar
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
            handleOpenModalEdit={handleOpenModalEdit} // Pasamos la función para editar
          />
        ))}
      </div>
      {openModalTarea && (
        <ModalCrearTarea
          tarea={tareaEditando}
          handleCloseModal={handleCloseModal}
          handleSaveTarea={handleSaveTarea}
        />
      )}
    </div>
  );
};
