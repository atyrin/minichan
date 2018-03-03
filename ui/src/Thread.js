import React, {Component} from 'react';
import {ListGroup, ListGroupItem, Media} from 'react-bootstrap';
import InputForm from "./InputForm"

class Thread extends Component {
    constructor(props) {
        super(props);
        this.loader = this.loader.bind(this);
        this.parser = this.parser.bind(this);
        this.state = {data: []};
        this.loader();
        console.log(props.match.params.id)
    }

    parser(json) {
        const style = {
            width: 200,
        };
        const config = {
            viewedImageSize: 0.8,
            backgroundOpacity: 0.6
        };
        var result = [];
        this.state.data.map((element, index) => {
            result.push(
                <ListGroupItem>
                    {element.image_id ?
                        <Media.Left align="top">
                            <img width={200} display={"inline-block"} src={"/thumb/" + element.image_id}
                                 alt="thumbnail"/>
                        </Media.Left> :
                        <div/>
                    }
                    <Media.Body>
                        <Media.Heading>
                            {element.creation_time + " #" + element.post_id}
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
        fetch("/api/thread/" + this.props.match.params.id)
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
            var currentThread = this.props.match.params.id;
        }
        return (
            <div>
                <h1 style={styles.welcome}>
                    Добро пожаловать. Снова. В тред.
                </h1>
                <InputForm page={"thread"} thread={currentThread}/>
                <ListGroup>
                    {threads}
                </ListGroup>
            </div>
        );
    }
}

export default Thread;
