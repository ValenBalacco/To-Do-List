import { create } from "zustand";
import { ISprint } from "../types/ISprint";

interface ISprintStore {
	sprints: ISprint[];
	sprintActivo: ISprint | null;
	setSprintActivo: (sprintActivo: ISprint | null) => void;
	setArraySprints: (sprints: ISprint[]) => void;
	agregarNuevoSprint: (nuevoSprint: ISprint) => void;
	editarUnSprint: (sprintEditado: ISprint) => void;
	eliminarUnSprint: (idSprint: string) => void;
}

export const sprintStore = create<ISprintStore>((set) => ({
	sprints: [],
	sprintActivo: null,

	setSprintActivo: (sprintActivo) => set({ sprintActivo }),
	setArraySprints: (arrayDeSprints) => set({ sprints: arrayDeSprints }),
	agregarNuevoSprint: (nuevoSprint) =>
		set((state) => ({ sprints: [...state.sprints, nuevoSprint] })),
	editarUnSprint: (sprintEditado) =>
		set((state) => {
			const arregloSprints = state.sprints.map((sprint) =>
				sprint.id === sprintEditado.id ? sprintEditado : sprint
			);
			return { sprints: arregloSprints };
		}),

	eliminarUnSprint: (idSprint) => {
		set((state) => {
			const arregloSprints = state.sprints.filter((sprint) => sprint.id !== idSprint);
			return { sprints: arregloSprints };
		});
	},
}));
