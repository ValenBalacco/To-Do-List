import { useEffect, useState } from "react";
import { useTareas } from "../../../Hooks/useTareas";
import { tareaStore } from "../../../Store/tareaStore";
import { CardListTareas } from "../../ui/CardListTareas/CardListTareas";
import { ModalTarea } from "../../ui/Modales/ModalTarea/ModalTarea";
import { ITarea } from "../../../types/ITarea";
import { Container, Row, Col, Button } from "react-bootstrap";

export const ViewTareas = () => {
	const { getTareas, tareas } = useTareas();

	useEffect(() => {
		getTareas();
	}, []);

	const [openModalTarea, setOpenModalTarea] = useState(false);

	const setTareaActiva = tareaStore((state) => state.setTareaActiva);

	const handleOpenModalEdit = (tarea: ITarea) => {
		setTareaActiva(tarea);
		setOpenModalTarea(true);
	};

	const handleCloseModal = () => {
		setOpenModalTarea(false);
	};

	return (
		<>
			<Container className="mt-4">
				<Row className="align-items-center mb-3">
					<Col>
						<h2>Tareas en el Backlog</h2>
					</Col>
					<Col className="text-end">
						<Button
							variant="primary"
							onClick={() => setOpenModalTarea(true)}
						>
							Agregar Tarea
						</Button>
					</Col>
				</Row>

				{tareas.length > 0 ? (
					tareas.map((el, index) => (
						<Row
							key={index}
							className="mb-3"
						>
							<Col>
								<CardListTareas
									tarea={el}
									handleOpenModalEdit={handleOpenModalEdit}
								/>
							</Col>
						</Row>
					))
				) : (
					<Row>
						<Col>
							<h4 className="text-muted">No hay Tareas en el Backlog</h4>
						</Col>
					</Row>
				)}
			</Container>

			{openModalTarea && (
				<ModalTarea
					show={openModalTarea}
					handleCloseModal={handleCloseModal}
				/>
			)}
		</>
	);
};
