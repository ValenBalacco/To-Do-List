import axios from "axios";
import { ISprint } from "../../types/ISprint";
import { putSprintList } from "../../http/sprints";

const API_URL = `${import.meta.env.VITE_API_URL}/sprintList`;

export const getAllSprintsController = async (): Promise<ISprint[] | undefined> => {
	try {
		const response = await axios.get<{ sprints: ISprint[] }>(API_URL);
		return response.data.sprints;
	} catch (error) {
		console.log(`Error al obtener los sprints ${error}`);
	}
};

export const createSprintController = async (sprintNueva: ISprint) => {
	try {
		const sprints = await getAllSprintsController();
		if (sprints) {
			await putSprintList([...sprints, sprintNueva]);
		} else {
			await putSprintList([sprintNueva]);
		}
		return sprintNueva;
	} catch (error) {
		console.log(error);
	}
};

export const updateSprintController = async (sprintEditado: ISprint) => {
	try {
		const sprints = await getAllSprintsController();
		if (sprints) {
			const result = sprints.map((sprint) =>
				sprint.id === sprintEditado.id ? { ...sprint, ...sprintEditado } : sprint
			);
			await putSprintList(result);
		}
		return sprintEditado;
	} catch (error) {
		console.log(error);
	}
};

export const deleteSprintController = async (sprintId: string) => {
	try {
		const sprints = await getAllSprintsController();
		if (sprints) {
			const result = sprints.filter((sprint) => sprint.id !== sprintId);
			await putSprintList(result);
		}
	} catch (error) {
		console.log(error);
	}
};
