import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { BacklogScreen as Backlog } from "./components/Screens/BacklogScreen/BacklogScreen";
import { ModalGestionarSprint } from "./components/ui/ModalGestionarSprint/ModalGestionarSprint";
import { SprintsScreen as Sprints } from "./components/Screens/SprintsScreen/SprintsScreen";
import styles from "./App.module.css";
import { ModalSprint } from "./components/ui/Modales/ModalSprint/ModalSprint";
interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  tasks: Task[]; // Add tasks to the Sprint interface
}

interface Task {
  id: string;
  name: string;
}

function App() {
  const [activeTab, setActiveTab] = useState("Backlog");
  const [sprints, setSprints] = useState<Sprint[]>(() => {
    try {
      const savedSprints = localStorage.getItem("sprints");
      return savedSprints ? JSON.parse(savedSprints) : [{ id: "1", name: "Sprint 1", startDate: "", endDate: "", tasks: [] }];
    } catch {
      return [{ id: "1", name: "Sprint 1", startDate: "", endDate: "", tasks: [] }];
    }
  });
  const [openModalSprint, setOpenModalSprint] = useState(false);
  const [sprintEditando, setSprintEditando] = useState<Sprint | null>(null);

  useEffect(() => {
    localStorage.setItem("sprints", JSON.stringify(sprints));
  }, [sprints]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab); // Cambiamos la pestaña activa
  };

  const handleOpenModalCreate = () => {
    setSprintEditando(null);
    setOpenModalSprint(true);
  };

  const handleOpenModalEdit = (sprint: Sprint) => {
    setSprintEditando(sprint);
    setOpenModalSprint(true);
  };

  const handleCloseModal = () => {
    setOpenModalSprint(false);
  };

  const handleSaveSprint = (sprint: Sprint) => {
    if (sprintEditando) {
      setSprints((prev) =>
        prev.map((s) => (s.id === sprint.id ? sprint : s))
      );
      Swal.fire("Sprint Actualizado", "El sprint ha sido actualizado correctamente.", "success");
    } else {
      setSprints((prev) => [...prev, { ...sprint, id: Date.now().toString(), tasks: [] }]);
      Swal.fire("Sprint Creado", "El sprint ha sido creado correctamente.", "success");
    }
    setOpenModalSprint(false);
  };

  const handleDeleteSprint = (id: string) => {
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
        setSprints((prev) => prev.filter((sprint) => sprint.id !== id));
        if (activeTab === id) {
          setActiveTab("Backlog");
        }
        Swal.fire("Eliminado", "El sprint ha sido eliminado.", "success");
      }
    });
  };

  const handleMoveToSprint = (task: Task, sprintId: string) => {
    setSprints((prev) =>
      prev.map((sprint) =>
        sprint.id === sprintId
          ? { ...sprint, tasks: [...(sprint.tasks || []), task] }
          : sprint
      )
    );
    Swal.fire("Tarea Movida", `La tarea ha sido movida al sprint correctamente.`, "success");
  };

  const updateSprintTasks = (sprintId: string, updatedTasks: Task[]) => {
    setSprints((prev) =>
      prev.map((sprint) =>
        sprint.id === sprintId ? { ...sprint, tasks: updatedTasks } : sprint
      )
    );
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>Administrador de Tareas</header>
      <div className={styles.mainContent}>
        <aside className={`${styles.sidebar} bg-light p-3 shadow-sm`}>
          <ul className="list-unstyled">
            <li
              className={`p-2 rounded ${activeTab === "Backlog" ? "bg-primary text-white shadow" : "hover-shadow"}`}
              onClick={() => handleTabChange("Backlog")}
            >
              Backlog
            </li>
            {sprints.map((sprint) => (
              <li
                key={sprint.id}
                className={`p-2 rounded ${activeTab === sprint.id ? "bg-primary text-white shadow" : "hover-shadow"}`}
              >
                <div onClick={() => handleTabChange(sprint.id)}>
                  <span>{sprint.name}</span>
                  <p className="text-muted small">
                    {sprint.startDate} - {sprint.endDate}
                  </p>
                </div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleOpenModalEdit(sprint)}>
                  ✏️
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSprint(sprint.id)}>
                  🗑️
                </button>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary w-100 mt-3 shadow" onClick={handleOpenModalCreate}>
            + Crear Sprint
          </button>
        </aside>
        <main className={styles.content}>
          {activeTab === "Backlog" && <Backlog moveToSprint={handleMoveToSprint} sprints={sprints} />}
          {sprints.some((sprint) => sprint.id === activeTab) && (
            <Sprints
              sprintId={activeTab}
              sprintName={
                sprints.find((sprint) => sprint.id === activeTab)?.name || ""
              }
              tasks={sprints.find((sprint) => sprint.id === activeTab)?.tasks || []}
              updateTasks={(updatedTasks) => updateSprintTasks(activeTab, updatedTasks)}
            />
          )}
        </main>
      </div>
      {openModalSprint && (
        <ModalGestionarSprint
          sprint={sprintEditando}
          handleCloseModal={handleCloseModal}
          handleSaveSprint={handleSaveSprint}
        />
      )}
    </div>
  );
}

export default App;
