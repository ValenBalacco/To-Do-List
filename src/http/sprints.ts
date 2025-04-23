import axios from "axios";
import { ISprint } from "../types/ISprint";
import { ISprintList } from "../types/ISprintList";

const API_URL = `${import.meta.env.VITE_API_URL}/sprintList`;

export const putSprintList = async (sprints: ISprint[]) => {
	try {
		const response = await axios.put<ISprintList>(API_URL, {
			sprints: sprints,
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
