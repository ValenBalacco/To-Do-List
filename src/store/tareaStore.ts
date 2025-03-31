import { create } from "zustand";
import { ITarea } from "../types/ITarea";

interface ITareaStore {
	tareas: ITarea[];
	tareaActiva: ITarea | null;
	setTareaActiva: (TareaActiva: ITarea | null) => void;
	setArrayTareas: (arrayDeTareas: ITarea[]) => void;
	agregarNuevaTarea: (nuevaTarea: ITarea) => void;
	editarUnaTarea: (tareaActualizada: ITarea) => void;
	eliminarUnaTarea: (idTarea: string) => void;
}

export const tareaStore = create<ITareaStore>((set) => ({
	tareas: [],
	tareaActiva: null,

	setTareaActiva: (tareaActivaIn) => set(() => ({ tareaActiva: tareaActivaIn })),

	setArrayTareas: (arrayDeTareas) => set(() => ({ tareas: arrayDeTareas })),

	agregarNuevaTarea: (nuevaTarea) => set((state) => ({ tareas: [...state.tareas, nuevaTarea] })),

	editarUnaTarea: (tareaEditada) =>
		set((state) => {
			const arregloTareas = state.tareas.map((tarea) =>
				tarea.id === tareaEditada.id ? { ...tarea, ...tareaEditada } : tarea
			);
			return { tareas: arregloTareas };
		}),

	//eliminar una tarea
	eliminarUnaTarea: (idTarea) =>
		set((state) => {
			const arregloTareas = state.tareas.filter((tarea) => tarea.id !== idTarea);
			return { tareas: arregloTareas };
		}),
}));
