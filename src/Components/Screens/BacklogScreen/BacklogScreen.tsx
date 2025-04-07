import { Col, Container, Row } from "react-bootstrap";
import { Viewsprints } from "../../Views/SprintList/ViewSprints";
import { ViewTareas } from "../../Views/TareasList/ViewTareas";

export const BacklogScreen = () => {
	return (
		<Container
			fluid
			className="mt-2 bg-light "
		>
			<Row>
				<Col
					md={4}
					lg={3}
				>
					<Viewsprints />
				</Col>
				<Col
					md={8}
					lg={8}
				>
					<ViewTareas />
				</Col>
			</Row>
		</Container>
	);
};
