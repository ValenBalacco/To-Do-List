import { useShallow } from "zustand/shallow";
import Swal from "sweetalert2";
import { ITarea } from "../types/ITarea";
import { tareaStore } from "../store/tareaStore";
import {
	editarTareaController,
	eliminarTareaController,
	getAllTareasController,
	postNuevaTareaController,
	moverTareaDeSprintController,
} from "../data/controllers/backlogController";
import { putTareasBacklog } from "../http/tareas";
import { putSprintList } from "../http/sprints";
import { getAllSprintsController } from "../data/controllers/sprintController";
import { sprintStore } from "../store/sprintStore";

export const useTareas = () => {
	const {
		tareas,
		setArrayTareas,
		agregarNuevaTarea,
		eliminarUnaTarea,
		editarUnaTarea,
		moverTareaDeSprint: moverTareaEnStore,
	} = tareaStore(
		useShallow((state) => ({
			tareas: state.tareas,
			setArrayTareas: state.setArrayTareas,
			agregarNuevaTarea: state.agregarNuevaTarea,
			eliminarUnaTarea: state.eliminarUnaTarea,
			editarUnaTarea: state.editarUnaTarea,
			moverTareaDeSprint: state.moverTareaDeSprint,
		}))
	);

	const getTareas = async () => {
		const data = await getAllTareasController();
		if (data) setArrayTareas(data);
	};

	const crearTarea = async (nuevaTarea: ITarea) => {
		agregarNuevaTarea(nuevaTarea);
		try {
			await postNuevaTareaController(nuevaTarea);
			Swal.fire("Éxito", "Tarea creada correctamente", "success");
		} catch (error) {
			eliminarUnaTarea(nuevaTarea.id!);
			console.log("Algo salió mal al crear la tarea");
		}
	};

	const putEditarTarea = async (tareaEditada: ITarea) => {
		// Obtenemos tanto las tareas del backlog como los sprints
		const [tareasBacklog, sprints] = await Promise.all([
			getAllTareasController(),
			getAllSprintsController(),
		]);

		if (!tareasBacklog || !sprints) return;

		let tareaModificada = null;

		// Verificar si la tarea existe en el backlog
		const existeEnBacklog = tareasBacklog.some((t) => t.id === tareaEditada.id);

		if (existeEnBacklog) {
			// Editar la tarea en el backlog
			const nuevasTareas = tareasBacklog.map((t) =>
				t.id === tareaEditada.id ? { ...t, ...tareaEditada } : t
			);

			// Actualizar el estado global de las tareas en el backlog
			tareaStore.setState({ tareas: nuevasTareas });
			tareaModificada = tareaEditada;
			await putTareasBacklog(nuevasTareas);
		} else {
			// Si no está en el backlog buscamos la tarea en los sprints
			const nuevosSprints = sprints.map((sprint) => {
				const tieneTarea = sprint.tareas.some((t) => t.id === tareaEditada.id);
				if (!tieneTarea) return sprint;

				return {
					...sprint,
					tareas: sprint.tareas.map((t) =>
						t.id === tareaEditada.id ? { ...t, ...tareaEditada } : t
					),
				};
			});

			// Actualizar el estado global de los sprints
			sprintStore.setState({ sprints: nuevosSprints });
			tareaModificada = tareaEditada;
			await putSprintList(nuevosSprints);
		}

		// Si la tarea modificada es la activa, actualizarla en el estado global
		if (tareaModificada && tareaStore.getState().tareaActiva?.id === tareaModificada.id) {
			tareaStore.setState({ tareaActiva: tareaModificada });
		}

		return tareaModificada;
	};

	const eliminarTarea = async (idTarea: string) => {
		const estadoPrevio = tareas.find((tarea) => tarea.id === idTarea);
		const confirm = await Swal.fire({
			title: "Estás seguro?",
			text: "Esta acción no se puede deshacer",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
		});
		if (!confirm.isConfirmed) return;
		eliminarUnaTarea(idTarea);
		try {
			await eliminarTareaController(idTarea);
			Swal.fire("Eliminado", "Tarea eliminada correctamente", "success");
		} catch (error) {
			if (estadoPrevio) agregarNuevaTarea(estadoPrevio);
			console.log("Algo salió mal al eliminar la tarea");
		}
	};

	const moverTareaDeSprint = async (idTarea: string, idSprint: string) => {
		try {
			const { tarea } = await moverTareaDeSprintController(idTarea, idSprint);
			moverTareaEnStore(idTarea, idSprint, tarea);
			Swal.fire("Tarea movida", "La tarea se ha enviado al sprint", "success");
		} catch (error) {
			Swal.fire("Error", "No se pudo mover la tarea", "error");
			console.error(error);
		}
	};

	return {
		getTareas,
		crearTarea,
		putEditarTarea,
		eliminarTarea,
		tareas,
		moverTareaDeSprint,
	};
};
