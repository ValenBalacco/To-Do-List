import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Sprint } from "../../../../store/useStore";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

type ModalSprintProps = {
	show: boolean;
	handleClose: VoidFunction;
	sprintToEdit?: Sprint | null;
	onSave: (sprint: Sprint) => void;
};

const initialSprintState: Sprint = {
	id: "",
	name: "",
	startDate: "",
	endDate: "",
	tasks: [],
};

export const ModalSprint: FC<ModalSprintProps> = ({ show, handleClose, sprintToEdit, onSave }) => {
	const [formValues, setFormValues] = useState<Sprint>(initialSprintState);

	useEffect(() => {
		if (sprintToEdit) {
			setFormValues(sprintToEdit);
		} else {
			setFormValues({ ...initialSprintState, id: uuidv4() }); // Generar un nuevo ID para un nuevo sprint
		}
	}, [sprintToEdit]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		// Validar campos obligatorios
		if (!formValues.name.trim() || !formValues.startDate || !formValues.endDate) {
			Swal.fire("Error", "Todos los campos son obligatorios.", "error");
			return;
		}

		// Validar fechas
		const startDate = new Date(formValues.startDate);
		const endDate = new Date(formValues.endDate);
		if (startDate > endDate) {
			Swal.fire("Error", "La fecha de inicio no puede ser mayor que la fecha de cierre.", "error");
			return;
		}

		onSave(formValues); // Guardar el sprint
		handleClose(); // Cerrar el modal
	};

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>{sprintToEdit ? "Editar Sprint" : "Crear Sprint"}</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>Nombre</Form.Label>
						<Form.Control
							type="text"
							name="name"
							value={formValues.name}
							onChange={handleChange}
							placeholder="Ingrese un nombre"
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Fecha de Inicio</Form.Label>
						<Form.Control
							type="date"
							name="startDate"
							value={formValues.startDate}
							onChange={handleChange}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Fecha de Cierre</Form.Label>
						<Form.Control
							type="date"
							name="endDate"
							value={formValues.endDate}
							onChange={handleChange}
							required
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Cancelar
					</Button>
					<Button variant="primary" type="submit">
						{sprintToEdit ? "Guardar Cambios" : "Crear Sprint"}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};
