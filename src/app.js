import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import App from './components/App';
import View from './components/View';
import Edit from './components/Edit';
import List from './components/List';
import ImageViewer from './components/ImageViewer';
import Print from './components/Print';

ReactDOM.render((
    <Router history={history}>
        <Switch>
            <Route path='/list/:attribute/:value' component={List} />
            <Route path='/view/:id' component={View} />
            <Route path='/edit/:id' component={Edit} />
            <Route path='/edit/' component={Edit} />
            <Route path='/image/' component={ImageViewer} />
            <Route path='/print/:id' component={Print} />
            <Route path='/' component={App} />
            <Route component={App} />
        </Switch>
    </Router>
), document.getElementById('app'));