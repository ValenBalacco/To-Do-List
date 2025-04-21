import axios from "axios";
import { ITarea } from "../../types/ITarea";
import { putTareasBacklog } from "../../http/tareas";
import { ISprint } from "../../types/ISprint";
import { getAllSprintsController } from "./sprintController";
import { putSprintList } from "../../http/sprints";

const API_URL = `${import.meta.env.VITE_API_URL}/backlog`;

export const getAllTareasController = async (): Promise<ITarea[] | undefined> => {
	try {
		const response = await axios.get<{ tareas: ITarea[] }>(API_URL);
		return response.data.tareas;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const postNuevaTareaController = async (nuevaTarea: ITarea) => {
	try {
		const response = await axios.get<{ tareas: ITarea[] }>(API_URL);

		const nuevoArray = [...response.data.tareas, nuevaTarea];

		await axios.put(API_URL, { tareas: nuevoArray });

		return nuevaTarea;
	} catch (error) {
		console.log(error);
	}
};

export const editarTareaController = async (tareaEditada: ITarea) => {
	try {
		const tareas = await getAllTareasController();
		if (tareas) {
			const result = tareas.map((tarea) =>
				tarea.id === tareaEditada.id
					? {
							...tarea,
							...tareaEditada,
					  }
					: tarea
			);
			await putTareasBacklog(result);
		}
		return tareaEditada;
	} catch (error) {
		console.log(error);
	}
};

export const eliminarTareaController = async (tareaId: string) => {
	try {
		const tareas = await getAllTareasController();
		if (tareas) {
			const result = tareas.filter((tarea) => tarea.id !== tareaId);
			await putTareasBacklog(result);
			return result;
		}
	} catch (error) {}
};

export const moverTareaDeSprintController = async (
	idTarea: string,
	idSprint: string
): Promise<{
	tarea: ITarea;
	sprintActualizados: ISprint[];
	backlogActualizado: ITarea[];
}> => {
	//Obtener la lista de tareas del backlog
	const backlog = await getAllTareasController();
	//Obtener la lista de sprints
	const sprints = await getAllSprintsController();

	//Ver si ambas respuestas son válidas
	if (!backlog) throw new Error("No se pudo obtener el backlog");
	if (!sprints) throw new Error("No se pudo obtener la lista de sprints");

	//Buscar la tarea que se quiere mover dentro del Backlog
	const tarea = backlog.find((t) => t.id === idTarea);
	if (!tarea) throw new Error("Tarea no encontrada en el backlog");

	//Buscar el sprint a donde se quiere mover la tarea
	const sprint = sprints.find((s) => s.id === idSprint);
	if (!sprint) throw new Error("Sprint no encontrado");

	//Agregar la tarea al array dentro del sprint seleccionado
	sprint.tareas.push(tarea);

	//Eliminar la tarea del backlog
	const nuevasTareas = await eliminarTareaController(idTarea);
	if (!nuevasTareas) throw new Error("No se pudo eliminar la tarea del backlog");

	//Guardar en la DB el nuevo estado del backlog
	await putTareasBacklog(nuevasTareas);
	//Guardar en la DB el nuevo estado de la lista de sprints
	await putSprintList(sprints);

	return {
		tarea,
		sprintActualizados: sprints,
		backlogActualizado: nuevasTareas,
	};
};
