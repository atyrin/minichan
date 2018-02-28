import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';

class About extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
            <Jumbotron>
              <h1>Правила</h1>
              <p>
                пау-пау
              </p>
              <p>
                <Button bsStyle="primary">Learn more</Button>
              </p>
            </Jumbotron>
        )
    }
}

export default About;
