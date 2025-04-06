import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { sprintStore } from "../../../Store/sprintStore";
import { ISprint } from "../../../types/ISprint";
import { useSprints } from "../../../Hooks/useSprints";
import { CardListSprints } from "../../ui/CardListSprints/CardListSprints";
import { ModalSprint } from "../../ui/Modales/ModalSprint/ModalSprint";

export const Viewsprints = () => {
	const { getSprints, sprints } = useSprints();

	useEffect(() => {
		getSprints();
	}, []);

	const [openModalSprint, setOpenModalSprint] = useState(false);

	const setSprintActivo = sprintStore((state) => state.setSprintActivo);

	const handleOpenModalEdit = (sprint: ISprint) => {
		setSprintActivo(sprint);
		setOpenModalSprint(true);
	};

	const handleCloseModal = () => {
		setOpenModalSprint(false);
	};

	return (
		<>
			<Container className="mt-4">
				<Row className="align-items-center mb-3">
					<Col>
						<h2>Sprints</h2>
					</Col>
					<Col className="text-end">
						<Button
							variant="primary"
							onClick={() => setOpenModalSprint(true)}
						>
							Agregar Sprint
						</Button>
					</Col>
				</Row>

				{sprints.length > 0 ? (
					sprints.map((el, index) => (
						<Row
							key={index}
							className="mb-3"
						>
							<Col>
								<CardListSprints
									sprint={el}
									handleOpenModalEdit={handleOpenModalEdit}
								/>
							</Col>
						</Row>
					))
				) : (
					<Row>
						<Col>
							<h4 className="text-muted">No hay sprints en el Backlog</h4>
						</Col>
					</Row>
				)}
			</Container>

			{openModalSprint && (
				<ModalSprint
					show={openModalSprint}
					handleCloseModal={handleCloseModal}
				/>
			)}
		</>
	);
};
