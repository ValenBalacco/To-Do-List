import { Container } from "react-bootstrap";
import { sprintStore } from "../../store/sprintStore";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
	const location = useLocation();
	const ventana = location.pathname.includes("/sprint");
	const sprintActivo = sprintStore((state) => state.sprintActivo);

	return (
		<Container
			fluid
			className="bg-light py-3 border-bottom bg-dark text-white "
		>
			<div className="d-flex justify-content-between align-items-center">
				{ventana && (
					<Link
						to={`/Backlog`}
						className="btn btn-primary "
					>
						Volver al Backlog
					</Link>
				)}
				<div className="d-flex justify-content-center">
					<h2 className="m-0">{ventana ? sprintActivo?.nombre : "Backlog"}</h2>
				</div>
				<div></div>
			</div>
		</Container>
	);
};
