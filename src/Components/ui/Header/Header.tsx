import { Container } from "react-bootstrap";
import { sprintStore } from "../../../Store/sprintStore";

export const Header = () => {
	const sprintActivo = sprintStore((state) => state.sprintActivo);
	return (
		<Container
			fluid
			className="bg-light py-3 border-bottom bg-dark text-white"
		>
			<div className="d-flex justify-content-center">
				<h2 className="m-0">{sprintActivo ? sprintActivo.nombre : "Backlog"}</h2>
			</div>
		</Container>
	);
};
