import { useState, useEffect } from "react";
import styles from "./ModalCrearTarea.module.css";
import { ITarea } from "../../../types/ITarea";

interface ModalCrearTareaProps {
	tarea?: ITarea | null;
	handleCloseModal: () => void;
	handleSaveTarea: (tarea: ITarea) => void;
}

export const ModalCrearTarea = ({
	tarea,
	handleCloseModal,
	handleSaveTarea,
}: ModalCrearTareaProps) => {
	const [titulo, setTitulo] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [fechaLimite, setFechaLimite] = useState("");

	useEffect(() => {
		if (tarea) {
			setTitulo(tarea.titulo);
			setDescripcion(tarea.descripcion);
			setFechaLimite(tarea.fechaLimite || "");
		} else {
			setTitulo("");
			setDescripcion("");
			setFechaLimite("");
		}
	}, [tarea]);

	const handleSubmit = () => {
		if (!titulo.trim() || !descripcion.trim()) return;
		const nuevaTarea: ITarea = {
			id: tarea?.id || Date.now().toString(),
			titulo,
			descripcion,
			fechaLimite,
		};
		handleSaveTarea(nuevaTarea);
	};

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<h2>{tarea ? "Editar Tarea" : "Crear Tarea"}</h2>
				<input
					type="text"
					placeholder="Título"
					value={titulo}
					onChange={(e) => setTitulo(e.target.value)}
				/>
				<textarea
					placeholder="Descripción"
					value={descripcion}
					onChange={(e) => setDescripcion(e.target.value)}
				/>
				<input
					type="date"
					value={fechaLimite}
					onChange={(e) => setFechaLimite(e.target.value)}
				/>
				<div>
					<button onClick={handleSubmit}>
						{tarea ? "Guardar Cambios" : "Crear Tarea"}
					</button>
					<button
						onClick={handleCloseModal}
						className={styles.closeButton}
					>
						Cancelar
					</button>
				</div>
			</div>
		</div>
	);
};
