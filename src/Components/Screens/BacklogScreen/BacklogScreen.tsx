import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { ModalTarea } from "../../ui/Modales/ModalTarea/ModalTarea";
import { useStore } from "../../../store/useStore";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
}

interface Sprint {
  id: string;
  name: string;
}

interface BacklogScreenProps {
  moveToSprint: (task: Task, sprintId: string) => void;
  sprints: Sprint[];
}

export const BacklogScreen: React.FC<BacklogScreenProps> = ({ moveToSprint, sprints }) => {
  const {
    tasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  } = useStore();
  const [taskEditando, setTaskEditando] = React.useState<Task | null>(null);
  const [openModalTask, setOpenModalTask] = React.useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenModalCreate = () => {
    setTaskEditando(null);
    setOpenModalTask(true);
  };

  const handleOpenModalEdit = (task: Task) => {
    setTaskEditando(task);
    setOpenModalTask(true);
  };

  const handleCloseModal = () => {
    setOpenModalTask(false);
  };

  const handleSaveTask = (task: Task) => {
    if (taskEditando) {
      updateTask(task);
      Swal.fire("Tarea Actualizada", "La tarea ha sido actualizada correctamente.", "success");
    } else {
      addTask({ ...task, status: "Backlog" });
      Swal.fire("Tarea Creada", "La tarea ha sido creada correctamente.", "success");
    }
    setOpenModalTask(false);
  };

  const handleDeleteTask = (id: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(id);
        Swal.fire("Eliminado", "La tarea ha sido eliminada.", "success");
      }
    });
  };

  const handleMoveToSprint = (task: Task, sprintId: string) => {
    moveToSprint(task, sprintId);
    Swal.fire("Tarea Movida", "La tarea ha sido movida al sprint.", "success");
  };

  // Filter tasks to show only those with status "Backlog"
  const backlogTasks = tasks.filter((task) => task.status === "Backlog");

  return (
    <div>
      <h2>Backlog</h2>
      <button className="btn btn-primary mb-3 shadow" onClick={handleOpenModalCreate}>
        + Crear Tarea
      </button>
      <ul className="list-group">
        {backlogTasks.map((task) => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-start shadow-sm rounded border border-primary">
            <div>
              <h5 className="text-dark">{task.title}</h5>
              <p className="text-muted">{task.description}</p>
              <small className="text-muted">Fecha Límite: {task.deadline}</small>
            </div>
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleOpenModalEdit(task)}>
                ✏️
              </button>
              <button className="btn btn-sm btn-danger me-2" onClick={() => handleDeleteTask(task.id)}>
                🗑️
              </button>
              <select
                className="form-select form-select-sm"
                onChange={(e) => handleMoveToSprint(task, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Mover a Sprint
                </option>
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
      {openModalTask && (
        <ModalTarea
          task={taskEditando}
          handleCloseModal={handleCloseModal}
          handleSaveTask={handleSaveTask}
        />
      )}
    </div>
  );
};
