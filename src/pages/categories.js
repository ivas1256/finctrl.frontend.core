import React, { Component, setState } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import { Modal } from "react-bootstrap";
import { Form } from 'react-bootstrap'
import { Table } from "react-bootstrap";
import CategoryTree  from "../components/categoryTree";

export class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            items:[],
            plainlist: [],
            currEntity: {
                categoryId: 0,
                categoryName: ''
            },
            obj: {}
        };
    }   

    handleClose = () => {
        this.setState({ show: false });
    }
    handleShow = () => {
        this.setState({ show: true });        
    }

    editCategory = (e) => {
        e.preventDefault();
        var serialize = require('form-serialize');            
        var obj = serialize(document.querySelector('#category-form'), { hash: true });        
        if(obj['parentCategory'])
            obj['parentCategory'] = {
                'categoryId': obj['parentCategory']
            }        

        var rUrl = 'api/categories' + (obj.categoryId <= 0 ? '' : '/' + obj.categoryId)
        var rType = obj.categoryId <= 0 ? 'POST' : 'PUT'                           

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

    componentDidMount = () =>{        
        fetch('api/categories/plain-list')
            .then(r => r.json())               
            .then(r => this.setState({plainlist: [ {}, ...r ] }))  

        fetch('api/categories')
            .then(response => response.json())        
            .then(resp => this.setState({items: resp}))                
    };    

    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Button variant="success" size="sm" onClick={this.handleShow}>Добавить категорию</Button>
                    </Row>
                    <Row>
                        <CategoryTree data={this.state.items} plainlist={this.state.plainlist}/>
                    </Row>                    
                </Container>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Создание категории</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.editCategory} id="category-form">
                        <Modal.Body>
                            <Form.Control type="hidden" name="categoryId" defaultValue={this.state.currEntity.categoryId}/>
                            <Form.Label>Название:</Form.Label>
                            <Form.Control type="text" name="categoryName" defaultValue={this.state.currEntity.categoryName} placeholder="Название категории" />
                            <Form.Label>Родительская категория:</Form.Label>
                            <Form.Select name="parentCategory" defaultValue={this.state.currEntity.parentCategory?.categoryId}>
                                {                                                                 
                                        this.state.plainlist && this.state.plainlist.map((v) => 
                                            <option key={v.categoryId} value={v.categoryId}>{v.categoryName}</option>
                                        )
                                }
                            </Form.Select>
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