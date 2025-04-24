import { useShallow } from "zustand/shallow";
import Swal from "sweetalert2";
import { ITarea, TareaEstado } from "../types/ITarea";
import { tareaStore } from "../store/tareaStore";
import {
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
        const [tareasBacklog, sprints] = await Promise.all([
            getAllTareasController(),
            getAllSprintsController(),
        ]);

        if (!tareasBacklog || !sprints) return;

        let tareaModificada = null;

        const existeEnBacklog = tareasBacklog.some((t) => t.id === tareaEditada.id);

        if (existeEnBacklog) {
            const nuevasTareas = tareasBacklog.map((t) =>
                t.id === tareaEditada.id ? { ...t, ...tareaEditada } : t
            );

            tareaStore.setState({ tareas: nuevasTareas });
            tareaModificada = tareaEditada;
            await putTareasBacklog(nuevasTareas);
        } else {
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

            sprintStore.setState({ sprints: nuevosSprints });
            tareaModificada = tareaEditada;
            await putSprintList(nuevosSprints);
        }

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
            const confirm = await Swal.fire({
                title: "¿Mover tarea al sprint?",
                text: "¿Estás seguro de que deseas mover esta tarea al sprint?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, mover",
                cancelButtonText: "Cancelar",
            });

            if (!confirm.isConfirmed) return;

            const { tarea } = await moverTareaDeSprintController(idTarea, idSprint);
            moverTareaEnStore(idTarea, idSprint, tarea);

            Swal.fire("Tarea movida", "La tarea se ha enviado al sprint", "success");
        } catch (error) {
            Swal.fire("Error", "No se pudo mover la tarea", "error");
            console.error(error);
        }
    };

    const cambiarEstadoDeTarea = async (tarea: ITarea, nuevoEstado: TareaEstado) => {
        const tareaActualizada = { ...tarea, estado: nuevoEstado };
        await putEditarTarea(tareaActualizada);
    };

    const moverTareaAlBacklog = async (tarea: ITarea) => {
        const confirm = await Swal.fire({
            title: "¿Mover tarea al backlog?",
            text: "¿Estás seguro de que deseas mover esta tarea al backlog?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, mover",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        const sprints = await getAllSprintsController();
        if (!sprints) return;

        const sprintEncontrado = sprints.find((sprint) =>
            sprint.tareas.some((t) => t.id === tarea.id)
        );
        if (!sprintEncontrado) return;

        const nuevoSprint = sprints.map((sprint) =>
            sprint.id === sprintEncontrado.id
                ? { ...sprint, tareas: sprint.tareas.filter((t) => t.id !== tarea.id) }
                : sprint
        );

        const backlog = await getAllTareasController();
        if (!backlog) return;

        const nuevoBacklog = [...backlog, { ...tarea, estado: "Por Hacer" as TareaEstado }];

        try {
            await putSprintList(nuevoSprint);
            await putTareasBacklog(nuevoBacklog);

            tareaStore.setState({ tareas: nuevoBacklog });
            sprintStore.setState({ sprints: nuevoSprint });

            Swal.fire("Tarea movida", "La tarea se ha enviado al backlog", "success");
        } catch (error) {
            console.error("Error al mover la tarea al backlog:", error);
            Swal.fire("Error", "No se pudo mover la tarea al backlog", "error");
        }
    };

    return {
        getTareas,
        crearTarea,
        putEditarTarea,
        eliminarTarea,
        tareas,
        moverTareaDeSprint,
        cambiarEstadoDeTarea,
        moverTareaAlBacklog,
    };
};
