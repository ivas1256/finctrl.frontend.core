import React, { Component, setState } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import { Modal } from "react-bootstrap";
import { Form } from 'react-bootstrap'
import {Table } from "react-bootstrap";

export class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            items:[],
            currEntity: {
                categoryId: -1,
                categoryName: ''
            }
            ,obj: {}
        };
    }

    handleClose = () => {
        this.setState({ show: false });
    }
    handleShow = () => {
        this.setState({ show: true });
    }

    componentDidMount = () =>{        
        fetch('api/categories')
            .then(response => response.json())        
            .then(resp => this.setState({items: resp}))        
    };

    editCategory = (e) => {
        e.preventDefault();
        var serialize = require('form-serialize');            
        var obj = serialize(document.querySelector('#category-form'), { hash: true });
        
        var rUrl = 'api/categories' + (obj.categoryId < 0 ? '' : '/' + obj.categoryId)
        var rType = obj.categoryId < 0 ? 'POST' : 'PUT'
        
        if(obj.categoryId < 0 )
            delete obj.categoryId            

        fetch(rUrl, {
            method: rType,
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(resp => this.setState({currEntity: {}}))
        .then(resp => {
            fetch('api/categories')
                .then(response => response.json())        
                .then(resp => this.setState({items: resp})) 
        })        
    };

    update = (id) => {        
        fetch(`api/categories/${id}`)
            .then(resp => resp.json())
            .then(resp => this.setState({currEntity: resp})) 

        this.handleShow()
    }

    delete = (id) => {
        fetch(`api/categories/${id}`, {
            method: 'DELETE'
        })
            .then(resp => resp.json())
            .then(resp => this.setState({currEntity: resp})) 
            .then(resp => {
                fetch('api/categories')
                    .then(response => response.json())        
                    .then(resp => this.setState({items: resp})) 
            })    
    }

    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Button variant="success" size="sm" onClick={this.handleShow}>Добавить категорию</Button>
                    </Row>
                    <Row>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Категория</th>
                                </tr>
                            </thead>
                            <tbody>                                
                                {this.state.items && this.state.items.map(({categoryId, categoryName}) => (
                                  <tr key={categoryId}>
                                    <td>{categoryId}</td>
                                    <td>{categoryName}</td>
                                    <td><Button onClick={() => this.update(categoryId)}>Upd</Button></td>
                                    <td><Button onClick={() => this.delete(categoryId)}>Del</Button></td>
                                  </tr>  
                                ))}
                            </tbody>
                        </Table>
                    </Row>
                </Container>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Создание категории</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.editCategory} id="category-form">
                        <Modal.Body>
                            <Form.Control type="hidden" name="categoryId" defaultValue={this.state.currEntity.categoryId}/>
                            <Form.Control type="text" name="categoryName" defaultValue={this.state.currEntity.categoryName} placeholder="Название категории" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Закрыть
                            </Button>
                            <Button type="submit" variant="primary" onClick={this.handleClose}>
                                Сохранить
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        );
    }
}