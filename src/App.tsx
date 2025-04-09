import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Sprint } from "./store/useStore";
import { BacklogScreen as Backlog } from "./components/Screens/BacklogScreen/BacklogScreen";
import { ModalSprint } from "./components/ui/Modales/ModalSprint/ModalSprint";
import { SprintsScreen as Sprints } from "./components/Screens/SprintsScreen/SprintsScreen";
import { useStore } from "./store/useStore";
import styles from "./App.module.css";

function App() {
  const {
    activeTab,
    setActiveTab,
    sprints,
    fetchSprints,
    addSprint,
    updateSprint,
    deleteSprint,
    moveTaskToSprint,
    updateSprintTasks,
  } = useStore();

  const [showModalSprint, setShowModalSprint] = useState(false);
  const [sprintToEdit, setSprintToEdit] = useState<Sprint | null>(null);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleOpenModalCreate = () => {
    setSprintToEdit(null);
    setShowModalSprint(true);
  };

  const handleOpenModalEdit = (sprint: Sprint) => {
    setSprintToEdit(sprint);
    setShowModalSprint(true);
  };

  const handleCloseModal = () => {
    setShowModalSprint(false);
    setSprintToEdit(null);
  };

  const handleSaveSprint = async (sprint: Sprint) => {
    try {
      if (sprintToEdit) {
        await updateSprint(sprint);
        Swal.fire("Sprint Actualizado", "El sprint ha sido actualizado correctamente.", "success");
      } else {
        await addSprint(sprint);
        Swal.fire("Sprint Creado", "El sprint ha sido creado correctamente.", "success");
      }
      fetchSprints();
      handleCloseModal();
    } catch (error) {
      console.error("Error guardando sprint:", error);
      Swal.fire("Error", "No se pudo guardar el sprint. Inténtalo de nuevo.", "error");
    }
  };

  const handleDeleteSprint = async (id: string) => {
    try {
      await deleteSprint(id);
      Swal.fire("Eliminado", "El sprint ha sido eliminado.", "success");
      if (activeTab === id) {
        setActiveTab("Backlog");
      }
    } catch (error) {
      console.error("Error eliminando sprint:", error);
      Swal.fire("Error", "No se pudo eliminar el sprint. Inténtalo de nuevo.", "error");
    }
  };

  const handleMoveToSprint = (task: any, sprintId: string) => {
    moveTaskToSprint(task, sprintId)
      .then(() => {
        Swal.fire("Tarea Movida", "La tarea ha sido movida al sprint correctamente.", "success");
      })
      .catch((error: unknown) => {
        console.error("Error moving task to sprint:", error);
        Swal.fire("Error", "No se pudo mover la tarea al sprint. Inténtalo de nuevo.", "error");
      });
  };

  if (!sprints.length) {
    return <div className="text-center mt-5">Cargando datos...</div>;
  }

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
      <ModalSprint
        show={showModalSprint}
        handleClose={handleCloseModal}
        sprintToEdit={sprintToEdit}
        onSave={handleSaveSprint}
      />
    </div>
  );
}

export default App;
