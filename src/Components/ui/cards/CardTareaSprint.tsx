import { FC } from "react";
import { getAllTareasController } from "../../../data/controllers/backlogController";
import { getAllSprintsController } from "../../../data/controllers/sprintController";
import { putTareasBacklog } from "../../../http/tareas";
import { tareaStore } from "../../../store/tareaStore";
import { putSprintList } from "../../../http/sprints";
import { sprintStore } from "../../../store/sprintStore";
import { Button, Card } from "react-bootstrap";
import { ITarea, TareaEstado } from "../../../types/ITarea";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
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

	const handleChangeEstado = (str: "menos" | "mas") => {
		const estados: TareaEstado[] = ["Por Hacer", "En Progreso", "Hecha"];
		const actualIndex = estados.indexOf(tarea.estado);
		let siguiente;
		if (str === "mas") {
			siguiente = estados[actualIndex + 1];
		} else if (str === "menos") {
			siguiente = estados[actualIndex - 1];
		}
		cambiarEstadoDeTarea(tarea, siguiente!);
	};

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
					{tarea.estado !== "Por Hacer" && (
						<Button
							variant="outline-info"
							onClick={() => handleChangeEstado("menos")}
						>
							<FaArrowLeft />
						</Button>
					)}
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

					{tarea.estado !== "Hecha" && (
						<Button
							variant="outline-info"
							onClick={() => handleChangeEstado("mas")}
						>
							<FaArrowRight />
						</Button>
					)}
				</div>
			</Card.Body>
		</Card>
	);
};
