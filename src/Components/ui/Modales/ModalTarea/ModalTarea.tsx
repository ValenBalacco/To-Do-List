import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { tareaStore } from "../../../../Store/tareaStore";
import { ITarea } from "../../../../types/iTarea";
import { useTareas } from "../../../../Hooks/useTareas";

type IModalTarea = {
	show: boolean;
	handleCloseModal: VoidFunction;
};

const initialState: ITarea = {
	titulo: "",
	descripcion: "",
	fechaLimite: "",
	estado: "Por hacer",
};

export const ModalTarea: FC<IModalTarea> = ({ handleCloseModal, show }) => {
	const tareaActiva = tareaStore((state) => state.tareaActiva);
	const setTareaActiva = tareaStore((state) => state.setTareaActiva);

	const { crearTarea, putTareaEditar } = useTareas();

	const [formValues, setFormValues] = useState<ITarea>(initialState);

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

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (tareaActiva) {
			putTareaEditar(formValues);
		} else {
			crearTarea({ ...formValues, id: Date.now().toString() });
		}
		setTareaActiva(null);
		handleCloseModal();
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
						/>
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
						/>
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
						/>
					</Form.Group>
					<Form.Select
						aria-label="Seleccionar Estado"
						name="estado"
						onChange={handleChange}
						value={formValues.estado}
					>
						<option value="Por Hacer">Por Hacer</option>
						<option value="En Progreso">En Progreso</option>
						<option value="Hecho">Hecho</option>
					</Form.Select>
					);
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
