import { Col, Container, Row } from "react-bootstrap";
import { Viewsprints } from "../../Views/SprintList/ViewSprints";
import { useTareas } from "../../../Hooks/useTareas";
import { useSprints } from "../../../Hooks/useSprints";
import { CardTareaBacklog } from "../../ui/CardTareaBacklog/CardTareaBacklog";
import { TareaEstado } from "../../../types/ITarea";
import { CardTareaSprint } from "../../ui/CardTareaSprint/CardTareaSprint";

export const SprintScreen = () => {
	const { tareas } = useTareas();
	const { sprintActivo } = useSprints();

	const filtroPorEstados = (filtroEstado: TareaEstado) =>
		tareas.filter(
			(tarea) => tarea.sprintId === sprintActivo?.id && tarea.estado == filtroEstado
		);

	return (
		<Container
			fluid
			className="bg-light min-vh-100"
		>
			<Row>
				<Col md={3}>
					<Viewsprints />
				</Col>
				<Col
					md={3}
					className="mt-4"
				>
					<div className="p-3 border border-primary rounded bg-white shadow-sm">
						<h5 className="text-center text-primary">Por Hacer</h5>
						<hr />
						{filtroPorEstados("Por Hacer").length > 0 ? (
							filtroPorEstados("Por Hacer").map((el, index) => (
								<Row
									key={index}
									className="mb-3"
								>
									<Col>
										<CardTareaSprint
											tarea={el}
											handleOpenModalEdit={() => {}}
										/>
									</Col>
								</Row>
							))
						) : (
							<Row>
								<Col>
									<h4 className="text-muted">No hay Tareas en progreso</h4>
								</Col>
							</Row>
						)}
					</div>
				</Col>
				<Col
					md={3}
					className="mt-4"
				>
					<div className="p-3 border border-warning rounded bg-white shadow-sm">
						<h5 className="text-center text-warning">En Progreso</h5>
						<hr />
						{filtroPorEstados("En Progreso").length > 0 ? (
							filtroPorEstados("En Progreso").map((el, index) => (
								<Row
									key={index}
									className="mb-3"
								>
									<Col>
										<CardTareaSprint
											tarea={el}
											handleOpenModalEdit={() => {}}
										/>
									</Col>
								</Row>
							))
						) : (
							<Row>
								<Col>
									<h4 className="text-muted">No hay Tareas en progreso</h4>
								</Col>
							</Row>
						)}
					</div>
				</Col>
				<Col
					md={3}
					className="mt-4"
				>
					<div className="p-3 border border-success rounded bg-white shadow-sm vh-80">
						<h5 className="text-center text-success">Hecho</h5>
						<hr />
						{filtroPorEstados("Hecha").length > 0 ? (
							filtroPorEstados("Hecha").map((el, index) => (
								<Row
									key={index}
									className="mb-3"
								>
									<Col>
										<CardTareaSprint
											tarea={el}
											handleOpenModalEdit={() => {}}
										/>
									</Col>
								</Row>
							))
						) : (
							<Row>
								<Col>
									<h4 className="text-muted">No hay Tareas en progreso</h4>
								</Col>
							</Row>
						)}
					</div>
				</Col>
			</Row>
		</Container>
	);
};
