import { ITarea } from "./iTarea";

export interface ISprint {
	id?: string;
	nombre: string;
	tareas: ITarea[];
	fechaInicio: string;
	fechaCierre: string;
}
