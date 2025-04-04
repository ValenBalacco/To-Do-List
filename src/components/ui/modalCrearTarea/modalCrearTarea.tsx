import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import styles from "./ModalCrearTarea.module.css";
import { ITarea } from "../../../types/ITarea";
import { tareaStore } from "../../../store/tareaStore";
import { useTareas } from "../../../hooks/useTareas";

type IModalCrearTarea = {
  handleCloseModal: VoidFunction
}
const initialState: ITarea = {
  titulo: "",
  descripcion: "",
  fechaLimite: "",
}

export const ModalCrearTarea: FC<IModalCrearTarea> = ({ handleCloseModal }) => {
  const tareaActiva = tareaStore((state) => state.tareaActiva)
  const setTareaActiva = tareaStore((state) => state.setTareaActiva)
  const { createTarea, putTareaEditar } = useTareas()
  const [formValues, setFormValues] = useState<ITarea>(initialState)
  useEffect(() => {
    if (tareaActiva) setFormValues(tareaActiva)
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [`${name}`]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (tareaActiva) {
      putTareaEditar(formValues)
    } else {
      const formattedValues = { ...formValues, id: crypto.randomUUID(), estado: formValues.estado ?? "pendiente" }
      createTarea(formattedValues)
    }
    handleCloseModal()
    setTareaActiva(null)
  }

  const handleCancelSubmit = () => {
    handleCloseModal()
    setTareaActiva(null)
  }

  return (
    <div className={styles.containerPrincipalModal}>
      <div className={styles.contentPopUP}>
        <div>
          <h1>{tareaActiva ? "Editar Tarea" : "Crear Tarea"}</h1>
        </div>
        <form onSubmit={handleSubmit} className={styles.formContent}>
          <div>
            Título
            <input value={formValues.titulo} onChange={handleChange} type="text" required autoComplete="off" name="titulo" />
            Descripción
            <textarea value={formValues.descripcion} onChange={handleChange} required name="descripcion" />
            Fecha Límite
            <input value={formValues.fechaLimite} onChange={handleChange} type="date" required autoComplete="off" name="fechaLimite" />
          </div>
          <div className={styles.buttonCard}>
            <button className={styles.buttonCrearTarea}>{tareaActiva ? "Editar Tarea" : "Crear Tarea"}</button>
            <button className={styles.buttonCancel} onClick={handleCancelSubmit}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};