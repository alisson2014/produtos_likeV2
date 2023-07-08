import { useState, useEffect } from "react"
import { useLocalStorage, httpRequester } from "service";
import { deleteFn, getCategories } from "controller";
import { Button, Table, Spinner } from "react-bootstrap";
import { MdAddCircle } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { BiEdit } from "react-icons/bi"
import { Categories as Form } from "components/Forms";
import { Buttons, Title, Box } from "./styles";
import { ICategories, id, localCategories } from "interface";
import { Actions } from "pages/styles";

export default function Home() {
    const [categories, setCategories, clearStorage] = useLocalStorage<localCategories>("categories", []);
    const [propsCategorie, setPropsCategorie] = useState<ICategories>({
        id: "",
        nomeCategoria: ""
    });

    const [show, setShow] = useState<boolean>(false);
    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);

    const editCategorie = (id: id): void => {
        httpRequester({ ...getCategories, id: id })
            .then((res) => {
                setPropsCategorie(res);
            });
        handleOpen();
    };

    const registerCategorie = (): void => {
        setPropsCategorie({
            id: "",
            nomeCategoria: ""
        });
        handleOpen();
    };

    useEffect(() => {
        if (categories.length === 0) {
            httpRequester(getCategories)
                .then((result) => {
                    setCategories(result);
                });
        }
    }, []);

    return (
        <Box>
            <Title>Categorias</Title>
            <Table
                striped
                bordered
                hover
                variant="dark"
                responsive
            >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Categoria</th>
                        <Actions>Ações</Actions>
                    </tr>
                </thead>
                <tbody>
                    {categories !== null && categories.length !== 0 ? (
                        categories.map((categorie) => {
                            const { id, nomeCategoria } = categorie;
                            return (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{nomeCategoria}</td>
                                    <Buttons>
                                        <Button
                                            title={`Editar ${nomeCategoria}`}
                                            variant="primary"
                                            onClick={() => editCategorie(id)}
                                        >
                                            <BiEdit size={20} /><span>Editar</span>
                                        </Button>
                                        <Button
                                            title={`Excluir ${nomeCategoria}`}
                                            variant="danger"
                                            onClick={() => {
                                                deleteFn({
                                                    id: id,
                                                    deleted: nomeCategoria,
                                                    typeData: "Categoria",
                                                    file: "/categorias"
                                                }, clearStorage);
                                            }}
                                        >
                                            <RiDeleteBin2Fill size={20} /><span>Excluir</span>
                                        </Button>
                                    </Buttons>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td><Spinner variant="primary" /></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Button
                title="Cadastrar"
                type="button"
                variant="info"
                size="lg"
                onClick={registerCategorie}
                style={{ alignSelf: "center" }}
            >
                <MdAddCircle size={20} />
                <span>Cadastrar</span>
            </Button>
            <Form
                show={show}
                props={propsCategorie}
                handleClose={handleClose}
            />
        </Box >
    );
};
