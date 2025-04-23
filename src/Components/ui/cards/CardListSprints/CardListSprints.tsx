import { FC, useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { useSprints } from "../../../../hooks/useSprint";
import { ISprint } from "../../../../types/ISprint";
import styles from "./CardListSprints.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";

type ICardListSprints = {
    sprint: ISprint;
    handleOpenModalEdit: (sprint: ISprint) => void;
};

export const CardListSprints: FC<ICardListSprints> = ({ sprint, handleOpenModalEdit }) => {
    const { eliminarSprint } = useSprints();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

 
    const [showModal, setShowModal] = useState(false);

    const eliminarSprintById = () => {
        eliminarSprint(sprint.id!);
    };

    const editarSprint = () => {
        handleOpenModalEdit(sprint);
    };

    const handleSelectSprint = () => {
        searchParams.set("sprintId", sprint.id!);
        navigate(`/sprint?${searchParams.toString()}`);
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <Card className={styles["card-container"]}>
                <div onClick={handleSelectSprint}>
                    <Card.Header>
                        <Card.Title className="fs-4 fw-bold mb-3 text-center ">
                            {sprint.nombre}
                        </Card.Title>
                    </Card.Header>
                    <Card.Body className={styles["card-body"]}>
                        <div className="mb-3 text-center">
                            <Card.Text className="mb-1">
                                <u>Inicio</u>: {sprint.fechaInicio}
                            </Card.Text>
                            <Card.Text className="mb-0">
                                <u>Cierre</u>: {sprint.fechaCierre}
                            </Card.Text>
                        </div>
                    </Card.Body>
                </div>
                <Card.Footer className="d-flex justify-content-center gap-2">
                    <Button
                        variant="outline-warning"
                        onClick={editarSprint}
                    >
                        Editar
                    </Button>
                    <Button
                        variant="outline-danger"
                        onClick={eliminarSprintById}
                    >
                        Eliminar
                    </Button>
                    <Button
                        variant="outline-primary"
                        onClick={handleShowModal}
                    >
                        Ver
                    </Button>
                </Card.Footer>
            </Card>

            
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Sprint</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Nombre:</strong> {sprint.nombre}</p>
                    <p><strong>Fecha de Inicio:</strong> {sprint.fechaInicio}</p>
                    <p><strong>Fecha de Cierre:</strong> {sprint.fechaCierre}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
