import * as React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import Button from "react-bootstrap/esm/Button";
import { Modal } from "react-bootstrap";
import { Form } from 'react-bootstrap'

class CategoryTree extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            show: false,            
            plainlist: props.plainlist,
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
        console.log(this.state.plainlist)
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
        else      
            obj['parentCategory'] = null

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
        .then(resp => window.location.reload())          
    };

    update = (id) => {        
        fetch(`api/categories/${id}`)
            .then(resp => resp.json())
            .then(resp => this.setState({currEntity: resp}))  
            .then(x => this.handleShow())        
    }

    delete = (id) => {
        fetch(`api/categories/${id}`, {
            method: 'DELETE'
        })
            .then(resp => resp.json())
            .then(resp => this.setState({currEntity: resp})) 
            .then(resp => window.location.reload())    
    }

    render() {
        return (
            <Container className="mt-2 p-0">
                {this.props.data.map(item => {
                    return (
                    <Accordion key={item.categoryId} className="mt-1" data-id={item.categoryId}>
                        <Accordion.Item>                            
                            <Container>
                                <Row>                                        
                                    <Col><Accordion.Header>{item.categoryName}</Accordion.Header></Col>
                                    <Col xs={1}><Button onClick={() => this.update(item.categoryId)}>Upd</Button></Col>
                                    <Col xs={1}><Button onClick={() => this.delete(item.categoryId)}>Del</Button></Col>
                                </Row>
                            </Container>                                
                            
                            <Accordion.Body>
                                <Accordion>
                                    {item.childCategories && <CategoryTree data={item.childCategories} plainlist={this.state.plainlist} />}
                                </Accordion>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>)
                })}

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Создание категории tree</Modal.Title>
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
            </Container>
        );
    }
}

export default CategoryTree;