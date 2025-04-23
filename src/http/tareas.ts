import axios from "axios";
import { ITarea } from "../types/ITarea";
import { IBacklog } from "../types/IBacklog";

const API_URL = `${import.meta.env.VITE_API_URL}/backlog`;

export const putTareasBacklog = async (tareas: ITarea[]) => {
	try {
		const response = await axios.put<IBacklog>(API_URL, {
			tareas: tareas,
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
