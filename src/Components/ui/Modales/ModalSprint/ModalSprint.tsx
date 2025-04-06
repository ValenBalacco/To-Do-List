import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { ISprint } from "../../../../types/ISprint";
import { sprintStore } from "../../../../Store/sprintStore";
import { useSprints } from "../../../../Hooks/useSprints";
import { Button, Form, Modal } from "react-bootstrap";

type IModalSprint = {
	show: boolean;
	handleCloseModal: VoidFunction;
};

const initialState: ISprint = {
	nombre: "",
	fechaInicio: "",
	fechaCierre: "",
	tareas: [],
};

export const ModalSprint: FC<IModalSprint> = ({ show, handleCloseModal }) => {
	const sprintActivo = sprintStore((state) => state.sprintActivo);
	const setSprintActivo = sprintStore((state) => state.setSprintActivo);

	const { crearSprint, putEditarSprint } = useSprints();

	const [formValues, setFormValues] = useState<ISprint>(initialState);

	useEffect(() => {
		if (sprintActivo) setFormValues(sprintActivo);
	}, [sprintActivo]);

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [`${name}`]: value }));
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (sprintActivo) {
			putEditarSprint(formValues);
		} else {
			crearSprint({ ...formValues, id: Date.now().toString() });
		}
		setSprintActivo(null);
		handleCloseModal();
	};

	return (
		<Modal
			show={show}
			onHide={handleCloseModal}
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>{sprintActivo ? "Editar Sprint" : "Crear Sprint"}</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>Nombre</Form.Label>
						<Form.Control
							type="text"
							required
							autoComplete="off"
							name="nombre"
							placeholder="Ingrese un nombre"
							value={formValues.nombre}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Fecha de Inicio</Form.Label>
						<Form.Control
							type="date"
							required
							autoComplete="off"
							name="fechaInicio"
							value={formValues.fechaInicio}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Fecha de Cierre</Form.Label>
						<Form.Control
							type="date"
							required
							autoComplete="off"
							name="fechaCierre"
							value={formValues.fechaCierre}
							onChange={handleChange}
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={handleCloseModal}
					>
						Cancelar
					</Button>
					<Button
						variant="primary"
						type="submit"
					>
						{sprintActivo ? "Editar Sprint" : "Crear Sprint"}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};
