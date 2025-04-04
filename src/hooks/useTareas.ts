import { useState, useEffect } from "react";
import { ITarea } from "../types/ITarea";

export const useTareas = () => {
  const [tareas, setTareas] = useState<ITarea[]>(() => {
    try {
      const savedTareas = localStorage.getItem("tareas");
      return savedTareas ? JSON.parse(savedTareas) : [];
    } catch {
      return [];
    }
  });

  const [tareasSprint, setTareasSprint] = useState<ITarea[]>(() => {
    try {
      const savedTareasSprint = localStorage.getItem("tareasSprint");
      return savedTareasSprint ? JSON.parse(savedTareasSprint) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }, [tareas]);

  useEffect(() => {
    localStorage.setItem("tareasSprint", JSON.stringify(tareasSprint));
  }, [tareasSprint]);

  const getTareas = () => {
    // No necesitamos cargar tareas aquí porque ya se cargan desde localStorage
  };

  const getTareasSprint = (sprintId: string) => {
    // No sobrescribimos el estado global, solo filtramos las tareas para la pantalla actual
    return tareasSprint.filter((tarea) => tarea.sprintId === sprintId);
  };

  const eliminarTarea = (idTarea: string) => {
    setTareas((prev) => prev.filter((tarea) => tarea.id !== idTarea));
    setTareasSprint((prev) => prev.filter((tarea) => tarea.id !== idTarea));
  };

  const moverTareaASprint = (idTarea: string, sprintId: string) => {
    const tarea = tareas.find((tarea) => tarea.id === idTarea);
    if (tarea) {
      setTareas((prev) => prev.filter((tarea) => tarea.id !== idTarea));
      setTareasSprint((prev) => [
        ...prev,
        { ...tarea, sprintId, estado: "pendiente" }, // Asignamos el sprintId y el estado "pendiente"
      ]);
    }
  };

  const putTareaEditar = (tareaEditada: ITarea) => {
    if (tareaEditada.sprintId) {
      setTareasSprint((prev) =>
        prev.map((tarea) =>
          tarea.id === tareaEditada.id ? tareaEditada : tarea
        )
      );
    } else {
      setTareas((prev) =>
        prev.map((tarea) =>
          tarea.id === tareaEditada.id ? tareaEditada : tarea
        )
      );
    }
  };

  const createTarea = (nuevaTarea: ITarea) => {
    if (nuevaTarea.sprintId) {
      setTareasSprint((prev) => [...prev, nuevaTarea]);
    } else {
      setTareas((prev) => [...prev, nuevaTarea]);
    }
  };

  const cambiarEstadoTarea = (idTarea: string, nuevoEstado: string) => {
    setTareasSprint((prev) =>
      prev.map((tarea) =>
        tarea.id === idTarea ? { ...tarea, estado: nuevoEstado } : tarea
      )
    );
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
    cambiarEstadoTarea,
  };
};