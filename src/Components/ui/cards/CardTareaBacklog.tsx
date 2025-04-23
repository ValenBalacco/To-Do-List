import { FC } from "react";
import { ITarea } from "../../../types/ITarea";
import { useTareas } from "../../../hooks/useTarea";
import { Card, Button, Form } from "react-bootstrap";
import { useSprints } from "../../../hooks/useSprint";

type ICardListTareas = {
	tarea: ITarea;
	handleOpenModalEdit: (tarea: ITarea) => void;
};

export const CardTareaBacklog: FC<ICardListTareas> = ({ tarea, handleOpenModalEdit }) => {
	const { eliminarTarea, moverTareaDeSprint } = useTareas();
	const { sprints } = useSprints();

	const eliminarTareaById = () => {
		eliminarTarea(tarea.id!);
	};

	const editarTarea = () => {
		handleOpenModalEdit(tarea);
	};

	const handleChangeSprint = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const idSprint = e.target.value;
		if (idSprint) {
			await moverTareaDeSprint(tarea.id!, idSprint);
		}
	};
	return (
		<Card className="shadow-sm background-color w-100 mb-3">
			<Card.Body
				style={{
					display: "grid",
					gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1.5fr auto",
					alignItems: "center",
					minHeight: "100px",
					gap: "1rem",
				}}
			>
				<Card.Title className="mb-0">{tarea.titulo}</Card.Title>

				<Card.Text className="mb-0">
					<strong>Descripción:</strong> {tarea.descripcion}
				</Card.Text>

				<Card.Text className="mb-0">
					<strong>Fecha Límite:</strong> <br />
					{tarea.fechaLimite}
				</Card.Text>

				<Card.Text className="mb-0">
					<strong>Estado:</strong> <br />
					{tarea.estado}
				</Card.Text>

				<Form.Group className="mb-0">
					<Form.Select
						size="sm"
						onChange={handleChangeSprint}
						value=""
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

				<div className="d-flex gap-2 justify-content-end">
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
