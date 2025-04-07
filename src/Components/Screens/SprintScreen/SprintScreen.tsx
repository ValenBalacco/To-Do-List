import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useSprints } from "../../../Hooks/useSprints";

export const SprintScreen = () => {
  const { sprintActivo } = useSprints();

  
	return (
		<Container
			fluid
			className="bg-light min-vh-100"
		>
			<Row>
				<Col md={4}>
					<div className="p-3 border border-primary rounded bg-white shadow-sm">
						<h5 className="text-center text-primary">Por Hacer</h5>
						<hr />
					</div>
				</Col>
				<Col md={4}>
					<div className="p-3 border border-warning rounded bg-white shadow-sm">
						<h5 className="text-center text-warning">Por Hacer</h5>
						<hr />
					</div>
				</Col>
				<Col md={4}>
					<div className="p-3 border border-success rounded bg-white shadow-sm vh-80">
						<h5 className="text-center text-success">Por Hacer</h5>
						<hr />
					</div>
				</Col>
			</Row>
		</Container>
	);
};
