import { FC } from "react";
import { ITarea } from "../../../types/ITarea";
import { useTareas } from "../../../Hooks/useTareas";
import { Card, Button, Form } from "react-bootstrap";
import { useSprints } from "../../../Hooks/useSprints";

type ICardListTareas = {
	tarea: ITarea;
	handleOpenModalEdit: (tarea: ITarea) => void;
};

export const CardTareaSprint: FC<ICardListTareas> = ({ tarea, handleOpenModalEdit }) => {
	const { eliminarTarea } = useTareas();
	const { sprints } = useSprints();
	const { cambiarSprintDeTarea } = useTareas();

	const eliminarTareaById = () => {
		eliminarTarea(tarea.id!);
	};

	const editarTarea = () => {
		handleOpenModalEdit(tarea);
	};

	const handleChangeSprint = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const nuevoSprint = e.target.value;
		cambiarSprintDeTarea(tarea.id!, nuevoSprint);
	};

	return (
		<Card className="shadow-sm background-color">
			<Card.Body className="d-flex justify-content-between align-items-center flex-wrap flex-md-nowrap">
				<Card.Title className="mb-2">{tarea.titulo}</Card.Title>
				<Card.Text className="mb-1">
					Descripción: <br /> {tarea.descripcion}
				</Card.Text>
				<Card.Text className="mb-0">
					Fecha Límite: <br />
					{tarea.fechaLimite}
				</Card.Text>
				<Card.Text className="mb-0">
					Estado: <br /> {tarea.estado}
				</Card.Text>

				<Form.Group>
					{/* <Form.Label className="mb-1">Seleccionar Sprint</Form.Label> */}
					<Form.Select
						className="mb-2"
						size="sm"
						onChange={handleChangeSprint}
						value={tarea.sprintId || ""}
						defaultValue=""
					>
						<option
							disabled
							value=""
						>
							Seleccione el sprint
						</option>
						{sprints.length > 0 ? (
							sprints.map((sprint) => (
								<option
									key={sprint.id}
									value={sprint.id}
								>
									{sprint.nombre}
								</option>
							))
						) : (
							<option>No hay Sprints</option>
						)}
					</Form.Select>
				</Form.Group>

				<div className="d-flex gap-2 mt-3 mt-md-0">
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
				</div>
			</Card.Body>
		</Card>
	);
};
