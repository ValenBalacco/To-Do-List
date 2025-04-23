export type TareaEstado = "Por Hacer" | "En Progreso" | "Hecha";

export interface ITarea {
	id?: string;
	titulo: string;
	descripcion: string;
	fechaLimite: string;
	estado: TareaEstado;
}
