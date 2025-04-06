import { FC } from "react";
import { ITarea } from "../../../types/iTarea";
import { useTareas } from "../../../Hooks/useTareas";
import { Card, Button, Form } from "react-bootstrap";

type ICardListTareas = {
	tarea: ITarea;
	handleOpenModalEdit: (tarea: ITarea) => void;
};

export const CardListTareas: FC<ICardListTareas> = ({ tarea, handleOpenModalEdit }) => {
	const { eliminarTarea } = useTareas();

	const eliminarTareaById = () => {
		eliminarTarea(tarea.id!);
	};

	const editarTarea = () => {
		handleOpenModalEdit(tarea);
	};

	return (
		<Card className="shadow-sm background-color">
			<Card.Body className="d-flex justify-content-between align-items-center flex-wrap flex-md-nowrap">
				<Card.Title className="mb-2">{tarea.titulo}</Card.Title>
				<Card.Text className="mb-1">
					Descripción: <br /> {tarea.descripcion}
				</Card.Text>
				<Card.Text className="mb-0">
					Fecha Límite: <br /> <strong>{tarea.fechaLimite}</strong>
				</Card.Text>
				<Card.Text className="mb-0">
					Estado: <br /> <strong>{tarea.estado}</strong>
				</Card.Text>

				<Form.Group>
					<Form.Label className="mb-1">Seleccionar Sprint</Form.Label>
					<Form.Select
						className="mb-2"
						// value={tarea.estado}
						size="sm"
					>
						<option>Backlog</option>
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
