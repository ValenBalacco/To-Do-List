import { FC } from "react";
import { getAllTareasController } from "../../../data/controllers/backlogController";
import { getAllSprintsController } from "../../../data/controllers/sprintController";
import { putTareasBacklog } from "../../../http/tareas";
import { tareaStore } from "../../../store/tareaStore";
import { putSprintList } from "../../../http/sprints";
import { sprintStore } from "../../../store/sprintStore";
import { Button, Card } from "react-bootstrap";
import { ITarea } from "../../../types/ITarea";
import { FaArrowRight } from "react-icons/fa";
import { useTareas } from "../../../hooks/useTarea";

type ICardTareaSprint = {
	tarea: ITarea;
	handleOpenModalEdit: (tarea: ITarea) => void;
};

export const CardTareaSprint: FC<ICardTareaSprint> = ({ tarea, handleOpenModalEdit }) => {
	const { cambiarEstadoDeTarea } = useTareas();

	const eliminarTareaById = async () => {
		const [tareasBacklog, sprints] = await Promise.all([
			getAllTareasController(),
			getAllSprintsController(),
		]);

		if (!tareasBacklog || !sprints) return;

		// Verificar si la tarea está en el backlog
		const tareaEnBacklog = tareasBacklog.find((t) => t.id === tarea.id);
		if (tareaEnBacklog) {
			// Eliminar tarea del backlog
			const nuevasTareasBacklog = tareasBacklog.filter((t) => t.id !== tarea.id);
			await putTareasBacklog(nuevasTareasBacklog);
			tareaStore.setState({ tareas: nuevasTareasBacklog });
		}

		// Verificar si la tarea está en algún sprint
		const tareaEnSprint = sprints.find((sprint) =>
			sprint.tareas.some((t) => t.id === tarea.id)
		);
		if (tareaEnSprint) {
			// Eliminar tarea de ese sprint
			const nuevosSprints = sprints.map((sprint) => {
				if (sprint.id === tareaEnSprint.id) {
					return {
						...sprint,
						tareas: sprint.tareas.filter((t) => t.id !== tarea.id),
					};
				}
				return sprint;
			});
			await putSprintList(nuevosSprints);
			sprintStore.setState({ sprints: nuevosSprints });
		}
	};

	const editarTarea = () => {
		handleOpenModalEdit(tarea);
	};

	const visionDeFlechaDeEstado = () => {
		if (tarea.estado === "Por Hacer") {
			return "En Progreso";
		} else if (tarea.estado === "En Progreso") {
			return "Hecha";
		} else {
			return null;
		}
	};

	const mostrarFlecha = visionDeFlechaDeEstado() !== null;

	return (
		<Card className="shadow-sm background-color">
			<Card.Header className="text-center">
				<Card.Title className="mb-2">{tarea.titulo}</Card.Title>
			</Card.Header>
			<Card.Body className="d-flex flex-column justify-content-between gap-2 text-center">
				<Card.Text className="mb-1">{tarea.descripcion}</Card.Text>
				<Card.Text className="mb-0">
					<u>Fecha Límite</u>: {tarea.fechaLimite}
				</Card.Text>

				<div className="d-flex gap-2 mt-3 mt-md-0 justify-content-center flex-wrap flex-md-nowrap">
					<Button
						variant="outline-warning"
						onClick={editarTarea}
					>
						Editar
					</Button>
					<Button
						variant="outline-danger"
						onClick={eliminarTareaById}
					>
						Eliminar
					</Button>
					{mostrarFlecha && (
						<Button
							variant="outline-info"
							onClick={() => "coso"}
						>
							<FaArrowRight />
						</Button>
					)}
				</div>
			</Card.Body>
		</Card>
	);
};
