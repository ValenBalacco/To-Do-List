import { Container } from "react-bootstrap";

export const Header = () => {
	return (
		<Container
			fluid
			className="bg-light py-3 border-bottom bg-dark text-white"
		>
			<div className="d-flex justify-content-center">
				<h2 className="m-0">Backlog</h2>
			</div>
		</Container>
	);
};
