import { useShallow } from "zustand/shallow";
import Swal from "sweetalert2";
import { sprintStore } from "../store/sprintStore";

import { ISprint } from "../types/ISprint";
import {
	createSprintController,
	deleteSprintController,
	getAllSprintsController,
	updateSprintController,
} from "../data/controllers/sprintController";

export const useSprints = () => {
	const {
		sprints,
		setArraySprints,
		agregarNuevoSprint,
		editarUnSprint,
		eliminarUnSprint,
		setSprintActivo,
		sprintActivo,
	} = sprintStore(
		useShallow((state) => ({
			sprints: state.sprints,
			setArraySprints: state.setArraySprints,
			agregarNuevoSprint: state.agregarNuevoSprint,
			editarUnSprint: state.editarUnSprint,
			eliminarUnSprint: state.eliminarUnSprint,
			setSprintActivo: state.setSprintActivo,
			sprintActivo: state.sprintActivo,
		}))
	);

	const getSprints = async () => {
		const data = await getAllSprintsController();
		if (data) setArraySprints(data);
	};

	const crearSprint = async (nuevoSprint: ISprint) => {
		agregarNuevoSprint(nuevoSprint);
		try {
			await createSprintController(nuevoSprint);
			Swal.fire("Éxito", "Sprint creado correctamente", "success");
		} catch (error) {
			eliminarUnSprint(nuevoSprint.id!);
			console.log("Algo salió mal al crear el sprint");
		}
	};

	const putEditarSprint = async (sprintEditado: ISprint) => {
		const estadoPrevio = sprints.find((el) => el.id === sprintEditado.id);
		editarUnSprint(sprintEditado);
		try {
			await updateSprintController(sprintEditado);
			Swal.fire("Éxito", "Tarea actualizada correctamente", "success");
		} catch (error) {
			if (estadoPrevio) editarUnSprint(estadoPrevio);
			console.log("Algo salió mal al editar el sprint");
		}
	};

	const eliminarSprint = async (idSprint: string) => {
		const estadoPrevio = sprints.find((el) => el.id === idSprint);
		const confirm = await Swal.fire({
			title: "Estás seguro?",
			text: "Esta acción no se puede deshacer",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
		});
		if (!confirm.isConfirmed) return;
		eliminarUnSprint(idSprint);
		try {
			await deleteSprintController(idSprint);
			Swal.fire("Eliminado", "Sprint eliminado correctamente", "success");
		} catch (error) {
			if (estadoPrevio) agregarNuevoSprint(estadoPrevio);
			console.log("Algo salió mal al eliminar la tarea");
		}
	};

	return {
		getSprints,
		crearSprint,
		putEditarSprint,
		eliminarSprint,
		sprints,
		sprintActivo,
		setSprintActivo,
	};
};
