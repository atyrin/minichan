import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route, Link} from "react-router-dom";
import Threads from "./Threads";
import Thread from "./Thread";
import About from "./About";
import Rules from "./Rules"
import ModerationPage from "./ModerationPage";

class App extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
            <Router>
                <div>
                    <Route exact path="/" component={Threads}/>
                    <Route path="/thread/:id" component={Thread}/>
                    <Route path="/about" component={About}/>
                    <Route path="/rules" component={Rules}/>
                    <Route path="/moderate" component={ModerationPage}/>
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
