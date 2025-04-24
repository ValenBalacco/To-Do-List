import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { ISprint } from "../../../types/ISprint";
import { sprintStore } from "../../../store/sprintStore";
import { Button, Form, Modal } from "react-bootstrap";
import { useSprints } from "../../../hooks/useSprint";
import Swal from "sweetalert2";
import * as Yup from "yup"; 
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

// Define el esquema de validación
const sprintSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio."),
    fechaInicio: Yup.date()
        .required("La fecha de inicio es obligatoria.")
        .typeError("La fecha de inicio no es válida."),
    fechaCierre: Yup.date()
        .required("La fecha de cierre es obligatoria.")
        .typeError("La fecha de cierre no es válida.")
        .min(Yup.ref("fechaInicio"), "La fecha de cierre no puede ser menor a la fecha de inicio."),
});

export const ModalSprint: FC<IModalSprint> = ({ show, handleCloseModal }) => {
	const sprintActivo = sprintStore((state) => state.sprintActivo);

	const { crearSprint, putEditarSprint } = useSprints();

	const [formValues, setFormValues] = useState<ISprint>(initialState);
	const [errors, setErrors] = useState<Record<string, string>>({}); 
	useEffect(() => {
		if (sprintActivo) setFormValues(sprintActivo);
	}, [sprintActivo]);

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [`${name}`]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {

			setErrors({});

			const formattedValues = {
				...formValues,
				fechaInicio: new Date(formValues.fechaInicio).toISOString().split("T")[0],
				fechaCierre: new Date(formValues.fechaCierre).toISOString().split("T")[0],
			};

			await sprintSchema.validate(formattedValues, { abortEarly: false });

			if (sprintActivo) {
				putEditarSprint(formValues);
			} else {
				crearSprint({ ...formValues, id: Date.now().toString() });
			}
			handleCloseModal();
		} catch (err) {

			if (err instanceof Yup.ValidationError) {
				const validationErrors: Record<string, string> = {};
				err.inner.forEach((error) => {
					if (error.path) {
						validationErrors[error.path] = error.message;
					}
				});
				setErrors(validationErrors); 
			}
		}
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
							isInvalid={!!errors.fechaInicio} 
						/>
						<Form.Control.Feedback type="invalid">{errors.fechaInicio}</Form.Control.Feedback>
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
							isInvalid={!!errors.fechaCierre} 
						/>
						<Form.Control.Feedback type="invalid">{errors.fechaCierre}</Form.Control.Feedback>
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
