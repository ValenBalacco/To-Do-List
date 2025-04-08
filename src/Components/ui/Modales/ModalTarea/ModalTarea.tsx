import React, { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
}

interface ModalTareaProps {
  task: Task | null;
  handleCloseModal: () => void;
  handleSaveTask: (task: Task) => void;
}

export const ModalTarea: React.FC<ModalTareaProps> = ({
  task,
  handleCloseModal,
  handleSaveTask,
}) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [deadline, setDeadline] = useState(task?.deadline || "");
  const [status, setStatus] = useState(task?.status || "Backlog");

  const handleSave = () => {
    if (!title.trim() || !deadline.trim()) {
      alert("El título y la fecha límite son obligatorios.");
      return;
    }
    handleSaveTask({
      id: task?.id || Date.now().toString(),
      title,
      description,
      deadline,
      status,
    });
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">{task ? "Editar Tarea" : "Crear Tarea"}</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="form-control mb-3"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="date"
              className="form-control mb-3"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completado">Completado</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
