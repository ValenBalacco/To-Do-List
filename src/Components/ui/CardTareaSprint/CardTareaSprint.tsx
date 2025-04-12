import { FC } from "react";
import { ITarea } from "../../../types/ITarea";
import { useTareas } from "../../../Hooks/useTareas";
import { Card, Button } from "react-bootstrap";

type ICardListTareas = {
	tarea: ITarea;
	handleOpenModalEdit: (tarea: ITarea) => void;
};

export const CardTareaSprint: FC<ICardListTareas> = ({ tarea, handleOpenModalEdit }) => {
	const { eliminarTarea } = useTareas();

	const eliminarTareaById = () => {
		eliminarTarea(tarea.id!);
	};

	const editarTarea = () => {
		handleOpenModalEdit(tarea);
	};

	return (
		<Card className="shadow-sm background-color">
			{/* justify-content-between align-items-center flex-wrap flex-md-nowrap */}
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
				</div>
			</Card.Body>
		</Card>
	);
};
