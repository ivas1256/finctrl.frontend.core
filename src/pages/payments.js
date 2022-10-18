import React, { Component } from "react";
import { Container, Row, Table, Form, Col } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";

export class Payments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    componentDidMount = () => {
        this.getList();
    }

    getList = () => {
        fetch('api/payment')
            .then(r => r.json())
            .then(r => this.setState({ items: r }))
    }

    render() {
        return (
            <Container>
                <Row>
                    <Form action="api/upload_payments" method="POST" encType="multipart/form-data">
                        <Form.Group controlId="formFile">
                            <Form.Label>Файл из банка с операциями</Form.Label>
                            <Form.Control name="file" type="file"/>
                            <Button type="submit">LOAD</Button>
                        </Form.Group>
                    </Form>
                </Row>
                <Row>
                    <Table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Дата</th>
                                <th>Сумма</th>
                                <th>Источник</th>
                                <th>Категория</th>
                                <th>Описание</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items && this.state.items.map((obj) => (
                                <tr key={obj.id}>
                                    <td>{obj.paymentDate}</td>
                                    <td>{obj.paymentSum}</td>
                                    <td>{obj.paymentSource.paymentSourceName}</td>
                                    <td>{obj.paymentCategory && obj.paymentCategory.CategoryName}</td>
                                    <td>{obj.paymentDescription}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        );
    }
}