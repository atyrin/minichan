import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Threads from "./Threads";
import Thread from "./Thread";
import About from "./About";

class App extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
            <Router>
                <div>
                <Route exact path="/new" component={Threads} />
                <Route path="/thread/:id" component={Thread} />
                <Route path="/about" component={About} />
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
