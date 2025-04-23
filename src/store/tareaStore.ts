import { create } from "zustand";
import { ITarea } from "../types/ITarea";

interface ITareaStore {
	tareas: ITarea[];
	tareaActiva: ITarea | null;
	setTareas: (tareas: ITarea[]) => void;
	setTareaActiva: (tareaActivaIn: ITarea | null) => void;
	setArrayTareas: (arrayDeTareas: ITarea[]) => void;
	agregarNuevaTarea: (nuevaTarea: ITarea) => void;
	editarUnaTarea: (tareaEditada: ITarea) => void;
	eliminarUnaTarea: (idTarea: string) => void;
	moverTareaDeSprint: (idTarea: string, idSprint: string, tarea: ITarea) => void;
}

export const tareaStore = create<ITareaStore>((set) => ({
	tareas: [],
	setTareas: (tareas) => set({ tareas }),
	tareaActiva: null,

	//Setear la tarea activa
	setTareaActiva: (tareaActivaIn) =>
		set(() => ({
			tareaActiva: tareaActivaIn,
		})),

	//Agregar el array de tareas
	setArrayTareas: (arrayDeTareas) =>
		set(() => ({
			tareas: arrayDeTareas,
		})),

	//Agregar nueva Tarea
	agregarNuevaTarea: (nuevaTarea) =>
		set((state) => ({
			tareas: [...state.tareas, nuevaTarea],
		})),

	//Editar una Tarea
	editarUnaTarea: (tareaEditada) =>
		set((state) => {
			const arregloTareas = state.tareas.map((tarea) =>
				tarea.id === tareaEditada.id
					? {
							...tarea,
							...tareaEditada,
					  }
					: tarea
			);
			return { tareas: arregloTareas };
		}),

	//Eliminar una tarea segun su ID
	eliminarUnaTarea: (idTarea) =>
		set((state) => ({
			tareas: state.tareas.filter((tarea) => tarea.id !== idTarea),
		})),

	//Mover una tarea del sprint
	moverTareaDeSprint: (idTarea, idSprint, tarea) => {
		set((state) => ({
			tareas: state.tareas.filter((t) => t.id !== idTarea),
		}));
	},
}));
