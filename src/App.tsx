import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styles from "./App.module.css";
import { Backlog } from "./components/screens/backlog/backlog";
import { Sprints } from "./components/screens/sprints/sprints";
import { ModalGestionarSprint } from "./components/ui/modalGestionarSprint/modalGestionarSprint";

interface Sprint {
  id: string;
  name: string;
}

function App() {
  const [activeTab, setActiveTab] = useState("Backlog");
  const [sprints, setSprints] = useState<Sprint[]>(() => {
    try {
      const savedSprints = localStorage.getItem("sprints");
      return savedSprints ? JSON.parse(savedSprints) : [{ id: "1", name: "Sprint 1" }];
    } catch {
      return [{ id: "1", name: "Sprint 1" }];
    }
  });
  const [openModalSprint, setOpenModalSprint] = useState(false);
  const [sprintEditando, setSprintEditando] = useState<Sprint | null>(null);

  useEffect(() => {
    localStorage.setItem("sprints", JSON.stringify(sprints));
  }, [sprints]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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
      setSprints((prev) => [...prev, { ...sprint, id: Date.now().toString() }]);
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

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>Administrador de Tareas</header>
      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <ul>
            <li
              className={activeTab === "Backlog" ? styles.activeTab : ""}
              onClick={() => handleTabChange("Backlog")}
            >
              Backlog
            </li>
            {sprints.map((sprint) => (
              <li
                key={sprint.id}
                className={activeTab === sprint.id ? styles.activeTab : ""}
              >
                <span onClick={() => handleTabChange(sprint.id)}>
                  {sprint.name}
                </span>
                <button onClick={() => handleOpenModalEdit(sprint)}>✏️</button>
                <button onClick={() => handleDeleteSprint(sprint.id)}>🗑️</button>
              </li>
            ))}
          </ul>
          <button onClick={handleOpenModalCreate}>+ Crear Sprint</button>
        </aside>
        <main className={styles.content}>
          {activeTab === "Backlog" && <Backlog />}
          {sprints.some((sprint) => sprint.id === activeTab) && (
            <Sprints
              sprintId={activeTab}
              sprintName={
                sprints.find((sprint) => sprint.id === activeTab)?.name || ""
              }
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