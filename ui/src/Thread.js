import React, {Component} from 'react';
import {Popover, OverlayTrigger, ListGroup, ListGroupItem, Media} from 'react-bootstrap';
import InputForm from "./InputForm"
import MediaViewer from "./MediaViewer"
import ThreadItem from "./ThreadItem"

class Thread extends Component {
    constructor(props) {
        super(props);
        this.loader = this.loader.bind(this);
        this.parser = this.parser.bind(this);
        this.handleCloseMediaView = this.handleCloseMediaView.bind(this);
        this.mediaClick = this.mediaClick.bind(this);
        this.state = {data: [], show: false,};
        this.loader();
    }

    mediaClick(contentType, contentUrl) {
        this.setState({show: true, contentUrl: contentUrl, contentType: contentType});
    }

    handleCloseMediaView() {
        this.setState({show: false});
    }

    parser(json) {
        var result = [];
        this.state.data.map((element, index) => {
            result.push(
                <ThreadItem element={element} mediaClick={this.mediaClick}/>
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
                <h2 style={styles.welcome}>
                    Добро пожаловать. Снова. В тред.
                </h2>
                <InputForm page={"thread"} thread={currentThread}/>
                <ListGroup>
                    {threads}
                </ListGroup>
                <MediaViewer show={this.state.show} contentType={this.state.contentType}
                             contentUrl={this.state.contentUrl} handleClose={this.handleCloseMediaView}/>
            </div>
        );
    }
}

export default Thread;
