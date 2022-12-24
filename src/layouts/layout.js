import React, { Component } from 'react'
import {Container, Row, Col, Nav} from 'react-bootstrap'

export class Layout extends Component {    
    render() {
        return (
        <Container fluid className="p-2">
            <Row>
                <Col lg="2">
                    <Nav  className="flex-column">
                        <Nav.Link href="/">Главная</Nav.Link> 
                        <Nav.Link href="/payments">Операции</Nav.Link> 
                        <Nav.Link href="/categories">Категории</Nav.Link> 
                        <Nav.Link href="/payment-sources">Источники платежей</Nav.Link> 
                        <Nav.Link href="/statistic">Статистика</Nav.Link> 
                    </Nav>
                </Col>
                <Col>
                    
                        {this.props.children}
                    
                </Col> 
            </Row>
        </Container>
        )
    }
}