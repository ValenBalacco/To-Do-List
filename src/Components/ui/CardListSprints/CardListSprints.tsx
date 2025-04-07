import { FC } from "react";
import { Card, Button } from "react-bootstrap";
import { useSprints } from "../../../Hooks/useSprints";
import { ISprint } from "../../../types/ISprint";
import styles from "./CardListSprints.module.css";
import { sprintStore } from "../../../Store/sprintStore";
import { useNavigate } from "react-router";

type ICardListSprints = {
	sprint: ISprint;
	handleOpenModalEdit: (sprint: ISprint) => void;
};

export const CardListSprints: FC<ICardListSprints> = ({ sprint, handleOpenModalEdit }) => {
	const { eliminarSprint } = useSprints();
	const setSprintActivo = sprintStore((state) => state.setSprintActivo);
	const navigate = useNavigate();

	const eliminarSprintById = () => {
		eliminarSprint(sprint.id!);
	};

	const editarSprint = () => {
		handleOpenModalEdit(sprint);
	};

	const handleSelectSprint = () => {
		setSprintActivo(sprint);
		navigate(`/sprint`);
	};

	return (
		<Card className={styles["card-container"]}>
			<div onClick={handleSelectSprint}>
				<Card.Header>
					<Card.Title className="fs-4 fw-bold mb-3 text-center ">
						{sprint.nombre}
					</Card.Title>
				</Card.Header>
				<Card.Body className={styles["card-body"]}>
					<div className="mb-3 text-center">
						<Card.Text className="mb-1">
							<u>Inicio</u>: {sprint.fechaInicio}
						</Card.Text>
						<Card.Text className="mb-0">
							<u>Cierre</u>: {sprint.fechaCierre}
						</Card.Text>
					</div>
				</Card.Body>
			</div>
			<Card.Footer className="d-flex justify-content-center gap-2">
				<Button
					variant="outline-warning"
					onClick={editarSprint}
				>
					Editar
				</Button>
				<Button
					variant="outline-danger"
					onClick={eliminarSprintById}
				>
					Eliminar
				</Button>
			</Card.Footer>
		</Card>
	);
};
