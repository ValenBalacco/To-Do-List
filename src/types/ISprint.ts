import { ITarea } from "./ITarea";

export interface ISprint {
	id?: string;
	nombre: string;
	tareas: ITarea[];
	fechaInicio: string;
	fechaCierre: string;
}
