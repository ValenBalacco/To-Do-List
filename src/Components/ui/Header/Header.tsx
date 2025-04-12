import { Container } from "react-bootstrap";
import { sprintStore } from "../../../Store/sprintStore";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
	const sprintActivo = sprintStore((state) => state.sprintActivo);

	const location = useLocation();

	const sprintScreen = location.pathname.includes("/sprint");

	return (
		<Container
			fluid
			className="bg-light py-3 border-bottom bg-dark text-white "
		>
			<div className="d-flex justify-content-between align-items-center">
				{sprintScreen && (
					<Link
						to={`/`}
						className="btn btn-primary "
					>
						Volver al Backlog
					</Link>
				)}
				<div className="d-flex justify-content-center">
					<h2 className="m-0">{sprintActivo ? sprintActivo.nombre : "Backlog"}</h2>
				</div>
				<div></div>
			</div>
		</Container>
	);
};
