import { create } from "zustand";
import { ISprint } from "../types/ISprint";

interface ISprintStore {
	sprints: ISprint[];
	sprintActivo: ISprint | null;
	setSprintActivo: (sprintActiva: ISprint | null) => void;
	setArraySprints: (arrayDeSprints: ISprint[]) => void;
	agregarNuevoSprint: (nuevoSprint: ISprint) => void;
	editarUnSprint: (sprintActualizado: ISprint) => void;
	eliminarUnSprint: (idSprint: ISprint) => void;
}

export const sprintStore = create<ISprintStore>((set) => ({
	sprints: [],
	sprintActivo: null,

	//setea el sprint activo
	setSprintActivo: (sprintActivaIn) => set(() => ({ sprintActivo: sprintActivaIn })),

	//setea el array de sprints
	setArraySprints: (arrayDeSprints) => set(() => ({ sprints: arrayDeSprints })),

	//agregar un nuevo sprint
	agregarNuevoSprint: (nuevoSprint) =>
		set((state) => ({ sprints: [...state.sprints, nuevoSprint] })),

	//editar un sprint
	editarUnSprint: (sprintEditado) =>
		set((state) => {
			const arregloSprints = state.sprints.map((sprint) =>
				sprint === sprintEditado ? sprintEditado : sprint
			);
			return { sprints: arregloSprints };
		}),

	//eliminar un sprint
	eliminarUnSprint: (idSprint) =>
		set((state) => {
			const arregloSprints = state.sprints.filter((sprint) => sprint !== idSprint);
			return { sprints: arregloSprints };
		}),
}));
