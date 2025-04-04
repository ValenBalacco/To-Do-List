import { useState } from "react";
import { ITarea } from "../types/ITarea";

export const useTareas = () => {
  const [tareas, setTareas] = useState<ITarea[]>([]);
  const [tareasSprint, setTareasSprint] = useState<ITarea[]>([]);

  const getTareas = () => {
    // Simulación de obtención de tareas desde una API o base de datos
    const tareasMock: ITarea[] = [
      { id: "1", titulo: "Tarea 1", descripcion: "Descripción de la tarea 1", fechaLimite: "2023-12-01" },
      { id: "2", titulo: "Tarea 2", descripcion: "Descripción de la tarea 2", fechaLimite: "2023-12-02" },
    ];
    setTareas(tareasMock);
  };

  const getTareasSprint = () => {
    // Simulación de obtención de tareas del sprint desde una API o base de datos
    const tareasSprintMock: ITarea[] = [
      { id: "3", titulo: "Tarea Sprint 1", descripcion: "Descripción de la tarea sprint 1", fechaLimite: "2023-12-31" },
    ];
    setTareasSprint(tareasSprintMock);
  };

  const eliminarTarea = (idTarea: string) => {
    setTareas((prev) => prev.filter((tarea) => tarea.id !== idTarea));
  };

  const moverTareaASprint = (idTarea: string) => {
    const tarea = tareas.find((tarea) => tarea.id === idTarea);
    if (tarea) {
      setTareas((prev) => prev.filter((tarea) => tarea.id !== idTarea));
      setTareasSprint((prev) => [...prev, tarea]);
    }
  };

  const putTareaEditar = (tareaEditada: ITarea) => {
    setTareas((prev) =>
      prev.map((tarea) => (tarea.id === tareaEditada.id ? tareaEditada : tarea))
    );
  };

  const createTarea = (nuevaTarea: ITarea) => {
    setTareas((prev) => [...prev, nuevaTarea]);
  };

  return {
    getTareas,
    tareas,
    eliminarTarea,
    moverTareaASprint,
    getTareasSprint,
    tareasSprint,
    putTareaEditar,
    createTarea,
  };
};