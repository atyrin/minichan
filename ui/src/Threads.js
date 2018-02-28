import React, {Component} from 'react';
import {ListGroup, ListGroupItem, Media} from 'react-bootstrap';
import {Link} from "react-router-dom";
import InputForm from "./InputForm"

class Threads extends Component {
    constructor(props) {
        super(props);
        this.loader = this.loader.bind(this);
        this.parser = this.parser.bind(this);
        this.state = {data: []};
        this.loader();
    }

    parser(json) {
        var result = [];
        this.state.data.map((element, index) => {
            result.push(
                <ListGroupItem>
                    {element.image_id ?
                        <Media.Left align="top">
                            <img width={200} src={"/thumb/" + element.image_id} alt="thumbnail"/>
                        </Media.Left> :
                        <div/>
                    }
                    <Media.Body>
                        <Media.Heading>
                            <Link to={"/thread/" + element.post_id}>{element.creation_time}</Link>
                            {" " + element.subject + " "}
                            {" Post count: " + element.bump_counter}
                        </Media.Heading>
                        <p>
                            {element.body}
                        </p>
                    </Media.Body>
                </ListGroupItem>
            )
        });
        return result;
    }

    loader() {
        fetch("/api/threads")
            .then((response) => response.json())
            .then(json => this.setState({data: json}))
    }

    render() {
        const styles = {
            welcome: {
                textAlign: "center"
            }
        };
        if (this.state.data) {
            var threads = this.parser();
        }
        return (
            <div>
                <h1 style={styles.welcome}>
                    Добро пожаловать. Снова.
                </h1>
                <InputForm/>
                <ListGroup>
                    {threads}
                </ListGroup>
            </div>
        );
    }
}

export default Threads;
