import React, { Component } from "react";
import { Container, Row, Table, Modal, Form } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";

export class PaymentSources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            items: [],
            categories: [],
            currEntity: -1
        };
    }

    handleClose = () => {
        this.setState({ show: false });
        this.setState({ currEntity: -1 })
    }
    handleShow = () => {
        this.setState({ show: true });
    }

    componentDidMount = () => {
        this.getList();
    }

    getList = () => {
        fetch('api/paymentsource')
            .then(r => r.json())
            .then(r => this.setState({ items: r }))

        fetch('api/categories')
            .then(r => r.json())
            .then(r => this.setState({ categories: r }))
    }

    setCategoryClick = (id) => {
        this.handleShow();
        this.setState({ currEntity: id })
    }

    save = (e) => {
        e.preventDefault();
        if (this.state.currEntity === -1)
            return

        fetch(`api/paymentsource/set_category/${this.state.currEntity}?categoryId=${this.state.selected}`)
        .then(() => this.getList())

        this.handleClose()
    }

    selectChanged = (id) =>{
        this.setState({selected: id})
    }

    render() {
        return (
            <Container>
                <Row>
                    <Table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Источник платежа</th>
                                <th>Соотв. категория</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items && this.state.items.map((obj) => (
                                <tr key={obj.id}>
                                    <td>{obj.id}</td>
                                    <td>{obj.paymentSourceName}</td>
                                    <td>{obj.category && obj.category.categoryName}</td>
                                    <td><Button onClick={() => this.setCategoryClick(obj.id)}>Set category</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Row>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Выбрать категорию</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.save}>
                        <Modal.Body>
                            <Form.Control as="select" name="categoryId"
                                onChange={e => this.selectChanged(e.target.value)}>
                                <option key="-1">Выберите...</option>
                                {
                                    this.state.categories && this.state.categories.map(({ categoryId, categoryName }) => (
                                        <option key={categoryId} value={categoryId}>{categoryName}</option>
                                    ))
                                }
                            </Form.Control>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Закрыть
                            </Button>
                            <Button type="submit" variant="primary">
                                Сохранить
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        );
    }
}