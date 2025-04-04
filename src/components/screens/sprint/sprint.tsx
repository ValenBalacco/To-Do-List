import styles from "./Sprint.module.css";

export const Sprint = () => {
  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.containerPrincipalSprints}>
        <h1>Sprint Prueba</h1>
        <button className={styles.crearTareaButton}>
          Crear Tarea
          <span className={`material-symbols-outlined ${styles.backlogIcon}`}>
            playlist_add
          </span>
        </button>

        <div className={styles.containerSprintProgress}>
          <div className={styles.sprintProgress}>
            <h2>Pendiente</h2>
            <hr />
            <div className={styles.targetSprintProgress}>
              <h4>Título: Tarea</h4>
              <p>Descripción: Descripción</p>
              <p>Fecha Límite: 2025-03-11</p>
              <div className={styles.targetProgressbuttons}>
                <button className={styles.enviarBacklogButton}>
                  <span className="material-symbols-outlined">
                    file_export
                  </span>
                </button>
                <button className={styles.moveButton}>
                  <span className="material-symbols-outlined">
                    double_arrow
                  </span>
                </button>
                <button className={styles.visibilityButton}>
                  <span className="material-symbols-outlined">visibility</span>
                </button>
                <button className={styles.editButton}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className={styles.deleteButton}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
          <div className={styles.sprintProgress}>
            <h2>En Progreso</h2>
            <hr />
          </div>
          <div className={styles.sprintProgress}>
            <h2>Completado</h2>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};