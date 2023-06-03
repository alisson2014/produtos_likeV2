import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { errorHandler, getData, save, useLocalStorage } from "service";
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { TextError } from "./styles";
import { ICategories, FormCategories, localCategories } from "interface";
import MFooter from "./ModalFooter";
import MHeader from "./ModalHeader";
import { optionsInputCategorie } from "./optionsHanlder";

export default function Categories({ show, props, handleClose }: FormCategories) {
    const { id, nome } = props;
    const [categories, setCategories, clearStorage] = useLocalStorage<localCategories>("categories", []);

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<ICategories>();

    useEffect(() => {
        setValue("id", id);
        setValue("nome", nome);
    }, [props, setValue]);

    useEffect(() => {
        if (categories.length === 0) {
            getData<ICategories>("categories").then((res) => {
                setCategories(res);
            });
        }
    }, [categories, setCategories]);

    const onSubmit = (data: ICategories): void => {
        save("categories", data)
            .then((res) => {
                if (res?.status) {
                    Swal.fire(
                        "Sucesso!",
                        res?.message,
                        "success"
                    ).then((res) => {
                        if (res.isConfirmed) {
                            clearStorage();
                            window.location.reload();
                        };
                    });
                } else {
                    Swal.fire(
                        "Erro!",
                        res?.message,
                        "error"
                    ).then(
                        (res) => res.isConfirmed && window.location.reload()
                    );
                }
            });
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <MHeader title="Cadastrar categoria" />
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px"
                }}>
                    <Form.Group controlId="id">
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                            defaultValue={id}
                            {...register("id")}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group controlId="categorie">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                            defaultValue={nome}
                            placeholder="Digite o nome da categoria"
                            {...register("nome", optionsInputCategorie)}
                        />
                        {errors?.nome && (
                            <TextError>
                                {errorHandler(errors?.nome?.type, { field: "Categoria", minLength: 3, maxLength: 50 })}
                            </TextError>
                        )}
                    </Form.Group>
                </Modal.Body>
                <MFooter onClick={handleClose} />
            </Form>
        </Modal>
    );
};
