export interface ITarea {
	id?: string;
	titulo: string;
	descripcion: string;
	fechaLimite: string;
	estado: "Por hacer" | "En progreso" | "Hecha";
}
