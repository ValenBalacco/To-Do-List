import { Col, Container, Row } from "react-bootstrap";
import { Viewsprints } from "./views/ViewSprints";
import { useSprints } from "../../hooks/useSprint";
import { ITarea, TareaEstado } from "../../types/ITarea";
import { useEffect, useState } from "react";
import { tareaStore } from "../../store/tareaStore";
import { ModalTarea } from "../ui/Modales/ModalTarea";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllTareasController } from "../../data/controllers/backlogController";
import { CardTareaSprint } from "../ui/CardListSprints/CardTareaSprint";

export const SprintScreen = () => {
	const { sprintActivo, sprints, setSprintActivo } = useSprints();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	useEffect(() => {
		const sprintId = searchParams.get("sprintId");

		if (!sprints.length) return;

		if (sprintId) {
			const foundSprint = sprints.find((sprint) => sprint.id === sprintId);
			if (foundSprint) {
				setSprintActivo(foundSprint);
			} else {
				navigate("/");
			}
		} else {
			setSprintActivo(null);
		}
	}, [searchParams, sprints, setSprintActivo]);

	useEffect(() => {
		if (sprintActivo?.id) {
			getAllTareasController();
		}
	}, [sprintActivo]);

	const [openModalTarea, setOpenModalTarea] = useState(false);

	const setTareaActiva = tareaStore((state) => state.setTareaActiva);

	const handleOpenModalEdit = (tarea: ITarea) => {
		setTareaActiva(tarea);
		setOpenModalTarea(true);
	};

	const handleCloseModal = () => {
		setTareaActiva(null);
		setOpenModalTarea(false);
	};

	const filtroPorEstados = (filtroEstado: TareaEstado): ITarea[] => {
		return sprintActivo?.tareas.filter((tarea) => tarea.estado === filtroEstado) || [];
	};
	return (
		<div style={{ height: "100vh", overflow: "hidden" }}>
			<Container
				fluid
				className="h-100"
			>
				<Row className="h-100">
					<Col md={3}>
						<Viewsprints />
					</Col>

					<Col
						md={3}
						className="mt-4 h-100"
					>
						<div
							className="p-3 border border-primary rounded bg-white shadow-sm d-flex flex-column"
							style={{ height: "88vh" }}
						>
							<h5 className="text-center text-primary">Por Hacer</h5>
							<hr />
							<div
								style={{ overflowY: "auto", overflowX: "hidden" }}
								className="flex-grow-1"
							>
								{filtroPorEstados("Por Hacer").length > 0 ? (
									filtroPorEstados("Por Hacer").map((el, index) => (
										<Row
											key={index}
											className="mb-3"
										>
											<Col>
												<CardTareaSprint
													tarea={el}
													handleOpenModalEdit={handleOpenModalEdit}
												/>
											</Col>
										</Row>
									))
								) : (
									<h4 className="text-muted">No hay tareas por hacer</h4>
								)}
							</div>
						</div>
					</Col>

					<Col
						md={3}
						className="mt-4 h-100"
					>
						<div
							className="p-3 border border-warning rounded bg-white shadow-sm d-flex flex-column"
							style={{ height: "88vh" }}
						>
							<h5 className="text-center text-warning">En Progreso</h5>
							<hr />
							<div
								style={{ overflowY: "auto", overflowX: "hidden" }}
								className="flex-grow-1"
							>
								{filtroPorEstados("En Progreso").length > 0 ? (
									filtroPorEstados("En Progreso").map((el, index) => (
										<Row
											key={index}
											className="mb-3"
										>
											<Col>
												<CardTareaSprint
													tarea={el}
													handleOpenModalEdit={handleOpenModalEdit}
												/>
											</Col>
										</Row>
									))
								) : (
									<h4 className="text-muted">No hay tareas en progreso</h4>
								)}
							</div>
						</div>
					</Col>

					<Col
						md={3}
						className="mt-4 h-100"
					>
						<div
							className="p-3 border border-success rounded bg-white shadow-sm d-flex flex-column"
							style={{ height: "88vh" }}
						>
							<h5 className="text-center text-success">Hecha</h5>
							<hr />
							<div style={{ overflowY: "auto", overflowX: "hidden" }}>
								{filtroPorEstados("Hecha").length > 0 ? (
									filtroPorEstados("Hecha").map((el, index) => (
										<Row
											key={index}
											className="mb-3"
										>
											<Col>
												<CardTareaSprint
													tarea={el}
													handleOpenModalEdit={handleOpenModalEdit}
												/>
											</Col>
										</Row>
									))
								) : (
									<h4 className="text-muted">No hay tareas hechas</h4>
								)}
							</div>
						</div>
					</Col>
				</Row>
			</Container>

			{openModalTarea && (
				<ModalTarea
					show={openModalTarea}
					handleCloseModal={handleCloseModal}
				/>
			)}
		</div>
	);
};
