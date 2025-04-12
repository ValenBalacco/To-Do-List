import { useShallow } from "zustand/shallow";
import { tareaStore } from "../Store/tareaStore";
import { editarTarea, eliminarTareaPorId, getAllTareas, postNuevaTarea } from "../http/tareas";
import Swal from "sweetalert2";
import { ITarea } from "../types/ITarea";

export const useTareas = () => {
	const { tareas, setArrayTareas, agregarNuevaTarea, eliminarUnaTarea, editarUnaTarea } =
		tareaStore(
			useShallow((state) => ({
				tareas: state.tareas,
				setArrayTareas: state.setArrayTareas,
				agregarNuevaTarea: state.agregarNuevaTarea,
				eliminarUnaTarea: state.eliminarUnaTarea,
				editarUnaTarea: state.editarUnaTarea,
			}))
		);

	const getTareas = async () => {
		const data = await getAllTareas();
		if (data) setArrayTareas(data);
	};

	const crearTarea = async (nuevaTarea: ITarea) => {
		agregarNuevaTarea(nuevaTarea);
		try {
			await postNuevaTarea(nuevaTarea);
			Swal.fire("Éxito", "Tarea creada correctamente", "success");
		} catch (error) {
			eliminarUnaTarea(nuevaTarea.id!);
			console.log("Algo salió mal al crear la tarea");
		}
	};

	const putEditarTarea = async (tareaEditada: ITarea) => {
		const estadoPrevio = tareas.find((el) => el.id === tareaEditada.id);
		editarUnaTarea(tareaEditada);
		try {
			await editarTarea(tareaEditada);
			Swal.fire("Éxito", "Tarea actualizada correctamente", "success");
		} catch (error) {
			if (estadoPrevio) editarUnaTarea(estadoPrevio);
			console.log("Algo salió mal al editar la tarea");
		}
	};

	const cambiarSprintDeTarea = async (tareaId: string, sprintId: string) => {
		const estadoPrevio = tareas.find((el) => el.id === tareaId);
		if (!estadoPrevio) return;

		editarUnaTarea({ ...estadoPrevio, sprintId: sprintId });

		const tareaActualizada = { ...estadoPrevio, sprintId: sprintId };

		try {
			await editarTarea(tareaActualizada);
		} catch (error) {
			editarUnaTarea(estadoPrevio);
			console.log(error);
		}
	};

	const eliminarTarea = async (idTarea: string) => {
		const estadoPrevio = tareas.find((el) => el.id === idTarea);
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
			await eliminarTareaPorId(idTarea);
			Swal.fire("Eliminado", "Tarea eliminada correctamente", "success");
		} catch (error) {
			if (estadoPrevio) agregarNuevaTarea(estadoPrevio);
			console.log("Algo salió mal al eliminar la tarea");
		}
	};

	return {
		getTareas,
		crearTarea,
		putEditarTarea,
		cambiarSprintDeTarea,
		eliminarTarea,
		tareas,
	};
};
