import React, { Component } from "react";
import { Container, Row, Table, Form, Col, Alert } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

export class Payments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            categories: [],
            totalCount: 0,
            isOnlyWithCategory: false
        };
    }

    componentDidMount = () => {        
        console.log('fetch') 
        fetch('api/payment/total-count')
            .then(r => r.text())            
            .then(r => this.setState({totalCount: r}))
                
        this.loadData(1, 100);

        var list = []
        fetch('api/categories')
            .then(r => r.json())  
            .then(r => {
                r.forEach(function(item, i, arr){                    
                    list[item.categoryId] = {
                            value: item.categoryId,
                            label: item.categoryName
                        }
                });

                this.setState({categories: list});                
            })   
    }
    
    onTableChange = (type, newState, currEntity, col) => {        
        console.log('table change')
        if(type === 'pagination'){        
            this.loadData(newState.page, 100);
            return;
        }

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currEntity)
        };

        fetch('api/payment/' + currEntity.paymentId, requestOptions)                
            .then(data => {
                if(!data.ok) {
                    alert('Erorr');
                    return;
                }                
                alert('saved!')
            });
    }

    loadData = (pageIndex, pageSize) => {      
        let url = 'api/payment?pageIndex='+ (pageIndex - 1) +'&pageSize=' + pageSize;
        if(this.state.isOnlyWithCategory)
            url += '&filter=true';
        
        fetch(url)                        
            .then(r => r.json())            
            .then(r => this.setState({ items: r }))
    }

    searchFormSubmit = (e) =>{ 
        this.setState({ isOnlyWithCategory: e.target.checked }, function () {
            console.log(this.state)
            this.loadData(1, 100);
        });        
    }

    render() {           
        const columns = [{
            dataField: 'paymentId',
            text: 'ID',
            editable: false
        }, {
            dataField: 'paymentDate',
            text: 'Дата', 
            editable: false,
            formatter: (cell, row) => {return moment(cell).format('DD.MM.YYYY HH:mm')}
        }, {
            dataField: 'paymentSum',
            text: 'Сумма',
            editable: false
        }, {
            dataField: 'paymentSource.paymentSourceName',
            text: 'Источник',
            editable: false
        }, {
            dataField: 'paymentCategory.categoryId',
            text: 'Категория',            
            formatter: (cell) => {
                if (cell && this.state.categories && cell in this.state.categories) {                    
                    return this.state.categories[cell].label
                }
                return ''
            },
            editor: {
                type: Type.SELECT,
                options: this.state.categories
            }
        }, {
            dataField: 'paymentDescription',
            text: 'Описание'
        }];

        var paginOpts = {                        
            totalSize: this.state.totalCount
        }

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

                    <Form.Check type="checkbox" label="Операции без категории"
                        onChange={this.searchFormSubmit}/>
                </Row>
                <Row>                    
                    <BootstrapTable keyField='paymentId'
                        remote={ {pagination: true} }                         
                        data={ this.state.items } columns={ columns } 
                        onTableChange = { this.onTableChange }                        
                        cellEdit={ cellEditFactory({ mode: 'click', afterSaveCell: this.onTableChange }) }   
                        pagination={ paginationFactory(paginOpts) }                     
                        striped hover condensed/>
                    
                </Row>
            </Container>
        );
    }
}