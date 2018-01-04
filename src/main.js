import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Users from './users/users'
import Timelines from './users/line'
import Login from './users/login'

ReactDOM.render((
    <Router>
        <div>
            <Switch>
                <Route path='/users' component={Users} />
                <Route path='/timeline' component={Timelines} />
                <Route path='/login' component={Login} />
                <Route component={Login} />
            </Switch>
        </div>
    </Router>
), document.getElementById('root'))