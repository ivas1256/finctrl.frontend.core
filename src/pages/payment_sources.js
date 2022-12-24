import React, { Component } from "react";
import { Container, Row, Table, Modal, Form } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

export class PaymentSources extends Component {
    constructor(props) {
        super(props);
        this.state = {            
            items: [],
            categories: []            
        };
    }
    
    componentDidMount = () => {
        // без задержки не работает, по возможности исправить
        setTimeout(() => {            
            fetch('api/paymentsource')
                .then(r => r.json())
                .then(r => {
                    r.forEach(function(item, i, arr){
                        if(item.category == null)
                            item.category = {
                                categoryId: -1,
                                categoryName: '---'
                            };
                    });
                    this.setState({ items: r })
                })
        }, 2000);
        
        var list = [];
        fetch('api/categories')
            .then(r => r.json())
            .then(r => {
                r.push({
                    categoryId: -1,
                    categoryName: '---'
                })

                r.forEach(function(item, i, arr){                    
                    list[item.categoryId] = {
                            value: item.categoryId,
                            label: item.categoryName
                        }
                });
                this.setState({categories: list});                
            })    
    }

    onTableChange(type, newState, currEntity, col){
        console.log(currEntity);
        if(newState === -1) return;
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currEntity)
        };

        fetch('api/paymentsource/' + currEntity.paymentSourceId, requestOptions)               
            .then(data => {
                if(!data.ok) {
                    alert('Erorr');
                    return;
                }                
                alert('saved!')
            });
    }
 
    render() {
        var columns = [{
            dataField: 'paymentSourceId',
            text: 'ID',
            editable: false
        }, {
            dataField: 'paymentSourceName',
            text: 'Источник',                         
        }, {
            dataField: 'category.categoryId',
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
        }];

        return (
            <Container>
                <Row>
                    <BootstrapTable keyField='paymentSourceId'                         
                            data={ this.state.items } columns={ columns } 
                            onTableChange = { this.onTableChange }                        
                            cellEdit={ cellEditFactory({ mode: 'click', blurToSave: false, afterSaveCell: this.onTableChange }) }                        
                            striped hover condensed/>                    
                </Row>                
            </Container>
        );
    }
}