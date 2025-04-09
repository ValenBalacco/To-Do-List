import React, { useState } from "react";
import { ModalTarea } from "../../ui/Modales/ModalTarea/ModalTarea";
import { useStore } from "../../../store/useStore";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
}

interface SprintsScreenProps {
  sprintId: string;
  sprintName: string;
  tasks: Task[];
  updateTasks: (updatedTasks: Task[]) => void; // Add a prop to update tasks
}

export const SprintsScreen: React.FC<SprintsScreenProps> = ({ sprintId, sprintName, tasks, updateTasks }) => {
  const { updateTask, deleteTask } = useStore();
  const [taskEditando, setTaskEditando] = useState<Task | null>(null);
  const [openModalTask, setOpenModalTask] = useState(false);

  const handleOpenModalEdit = (task: Task) => {
    setTaskEditando(task);
    setOpenModalTask(true);
  };

  const handleCloseModal = () => {
    setOpenModalTask(false);
  };

  const handleSaveTask = (task: Task) => {
    updateTask(task);
    setOpenModalTask(false);
  };

  const handleDeleteTask = (id: string) => {
    const taskElement = document.getElementById(`task-${id}`);
    if (taskElement) {
      taskElement.classList.add("removed");
      setTimeout(() => {
        deleteTask(id);
      }, 500); // Match the duration of the fadeOut animation
    }
  };

  const handleChangeStatus = (task: Task, direction: "left" | "right") => {
    const statuses = ["Pendiente", "En Progreso", "Completado"];
    const currentIndex = statuses.indexOf(task.status);
    const newIndex =
      direction === "left" ? Math.max(0, currentIndex - 1) : Math.min(statuses.length - 1, currentIndex + 1);
    const newStatus = statuses[newIndex];

    updateTask({ ...task, status: newStatus });
  };

  const tasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className="container">
      <h2 className="mb-4 text-center text-primary">{sprintName}</h2>
      <div className="row g-3">
        {["Pendiente", "En Progreso", "Completado"].map((status) => (
          <div key={status} className="col-md-4">
            <h3 className="text-center text-secondary">{status}</h3>
            <ul className="list-group">
              {tasksByStatus(status).map((task) => (
                <li
                  key={task.id}
                  id={`task-${task.id}`}
                  className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded border border-primary"
                >
                  <div>
                    <h5 className="text-dark">{task.title}</h5>
                    <p className="text-muted">{task.description}</p>
                    <small className="text-muted">Fecha Límite: {task.deadline}</small>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleChangeStatus(task, "left")}
                      disabled={task.status === "Pendiente"}
                    >
                      ⬅️
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleChangeStatus(task, "right")}
                      disabled={task.status === "Completado"}
                    >
                      ➡️
                    </button>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleOpenModalEdit(task)}>
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(task.id)}>
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
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
