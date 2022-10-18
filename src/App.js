import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Categories } from './pages/categories';
import { IndexContent } from './pages/index_content';
import { PaymentSources } from './pages/payment_sources';
import { Payments } from './pages/payments';
import { Statistic } from './pages/statistic';
import { Layout } from "./layouts/layout";

export default class App extends Component {
    static displayName = App.name;    
    render() {       
        return (
            <Layout>
                <Router>
                    <Routes>
                        <Route path="/" element={<IndexContent/>}/>
                        <Route path="/categories" element={<Categories/>}/>
                        <Route path="/payment-sources" element={<PaymentSources/>}/>
                        <Route path="/statistic" element={<Statistic/>}/>
                        <Route path="/payments" element={<Payments/>}/>                    
                    </Routes>
                </Router>
            </Layout>
        );
    }
}