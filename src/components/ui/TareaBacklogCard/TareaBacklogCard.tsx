import styles from "./TareaBacklogCard.module.css";
import { ITarea } from "../../../types/ITarea";

interface TareaBacklogCardProps {
	tarea: ITarea;
	handleOpenModalEdit: (tarea: ITarea) => void;
	handleDeleteTarea: (idTarea: string) => void;
	handleMoveToSprint: (idTarea: string, sprintId: string) => void;
	sprints: { id: string; name: string }[]; // Lista de sprints disponibles
}

export const TareaBacklogCard = ({
	tarea,
	handleOpenModalEdit,
	handleDeleteTarea,
	handleMoveToSprint,
	sprints,
}: TareaBacklogCardProps) => {
	const handleSprintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const sprintId = e.target.value;
		if (sprintId) {
			handleMoveToSprint(tarea.id ?? "", sprintId);
		}
	};

	return (
		<div className={styles.card}>
			<h3>{tarea.titulo}</h3>
			<p>{tarea.descripcion}</p>
			<div className={styles.actions}>
				<button onClick={() => handleOpenModalEdit(tarea)}>Editar</button>
				<button onClick={() => tarea.id && handleDeleteTarea(tarea.id)}>Eliminar</button>
				<div className={styles.dropdown}>
					<h3>Mover a:</h3>
					<select
						onChange={handleSprintChange}
						defaultValue=""
					>
						<option
							value=""
							disabled
						>
							Seleccionar Sprint
						</option>
						{sprints.map((sprint) => (
							<option
								key={sprint.id}
								value={sprint.id}
							>
								{sprint.name}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};
