import React, {Component} from 'react';
import {ListGroup, ListGroupItem, Media, Badge} from 'react-bootstrap';
import {Link} from "react-router-dom";
import InputForm from "./InputForm"
import Rules from "./Rules";

class Threads extends Component {
    constructor(props) {
        super(props);
        this.loader = this.loader.bind(this);
        this.parser = this.parser.bind(this);
        this.state = {data: []};
        this.loader();
    }

    parser(json) {
        const styles = {
            bumpCounter: {
                float: "right"
            }
        }
        var result = [];
        this.state.data.map((element, index) => {
            result.push(
                <ListGroupItem>
                    {
                        element.image_id ?
                        <Media.Left align="top">
                            <Link to={"/thread/" + element.post_id}>
                                {
                                    element.content_type === "video/webm" ?
                                        <img width={200} class="videoThumbnail" src={"/thumb/" + element.image_id}
                                             alt="video"/> :
                                        <img width={200} src={"/thumb/" + element.image_id} alt="image"/>
                                }
                            </Link>
                        </Media.Left> :
                        <div/>
                    }
                    <Media.Body>
                        <Media.Heading>
                            <Link to={"/thread/" + element.post_id}>
                                {element.creation_time + " " + element.subject + " #" + element.post_id}
                            </Link>
                            <Badge style={styles.bumpCounter}>
                                {" Count: " + element.bump_counter}
                            </Badge>
                        </Media.Heading>
                        <p>
                            <div dangerouslySetInnerHTML={{__html: element.body}}/>
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
                <h2 style={styles.welcome}>
                    Добро пожаловать. Снова.
                </h2>
                <InputForm page={"main"}/>
                <ListGroup>
                    {threads}
                </ListGroup>
                <Rules/>
                <Link to={"/about"}>About</Link>
            </div>
        );
    }
}

export default Threads;
