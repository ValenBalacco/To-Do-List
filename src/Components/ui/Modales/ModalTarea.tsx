import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { tareaStore } from "../../../store/tareaStore";
import { ITarea } from "../../../types/ITarea";
import { useTareas } from "../../../hooks/useTarea";
import * as Yup from "yup";

type IModalTarea = {
	show: boolean;
	handleCloseModal: VoidFunction;
};

const initialState: ITarea = {
	titulo: "",
	descripcion: "",
	fechaLimite: "",
	estado: "Por Hacer",
};

const tareaSchema = Yup.object().shape({
    titulo: Yup.string()
        .required("El título es obligatorio.")
        .min(3, "El título debe tener al menos 3 caracteres."),
    descripcion: Yup.string()
        .required("La descripción es obligatoria.")
        .min(10, "La descripción debe tener al menos 10 caracteres."),
    fechaLimite: Yup.date()
        .required("La fecha límite es obligatoria.")
        .typeError("La fecha límite no es válida.")
        .min(new Date(), "La fecha límite no puede ser anterior a hoy."),
});

export const ModalTarea: FC<IModalTarea> = ({ handleCloseModal, show }) => {
	const tareaActiva = tareaStore((state) => state.tareaActiva);
	const setTareaActiva = tareaStore((state) => state.setTareaActiva);

	const { crearTarea, putEditarTarea } = useTareas();

	const [formValues, setFormValues] = useState<ITarea>(initialState);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (tareaActiva) setFormValues(tareaActiva);
		else setFormValues(initialState);
	}, [tareaActiva]);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {

			await tareaSchema.validate(formValues, { abortEarly: false });
			if (tareaActiva) {
				putEditarTarea(formValues);
			} else {
				crearTarea({ ...formValues, id: Date.now().toString() });
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
				<Modal.Title>{tareaActiva ? "Editar Tarea" : "Crear Tarea"}</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>Título</Form.Label>
						<Form.Control
							type="text"
							required
							autoComplete="off"
							name="titulo"
							placeholder="Ingrese un título"
							value={formValues.titulo}
							onChange={handleChange}
							isInvalid={!!errors.titulo} 
						/>
						<Form.Control.Feedback type="invalid">
							{errors.titulo}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Descripción</Form.Label>
						<Form.Control
							as="textarea"
							required
							name="descripcion"
							placeholder="Ingrese una descripción"
							value={formValues.descripcion}
							onChange={handleChange}
							rows={3}
							isInvalid={!!errors.descripcion} 
						/>
						<Form.Control.Feedback type="invalid">
							{errors.descripcion}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Fecha Límite</Form.Label>
						<Form.Control
							type="date"
							required
							autoComplete="off"
							name="fechaLimite"
							value={formValues.fechaLimite}
							onChange={handleChange}
							isInvalid={!!errors.fechaLimite} 
						/>
						<Form.Control.Feedback type="invalid">
							{errors.fechaLimite}
						</Form.Control.Feedback>
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
						{tareaActiva ? "Editar Tarea" : "Crear Tarea"}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};
