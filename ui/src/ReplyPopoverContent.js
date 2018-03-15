import React, {Component} from 'react';
import {Popover, Media, ListGroup, ProgressBar} from 'react-bootstrap';
import ThreadItem from "./ThreadItem"

class ReplyPopoverContent extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        console.log("Mount ReplyPopover");
        this.loadReplies();
    }

    loadReplies() {
        this.setState({data: []});
        console.log(this.props.replies);
        this.props.replies.map(
            (reply, index) => {
                console.log("Reply: " + reply.substring(2));
                fetch("/api/post/" + reply.substring(2))
                    .then((response) => response.json())
                    .then(element => {
                        this.state.data.push(
                            <div>
                                <strong>{reply}</strong>
                                <div style={{width: "80%"}} dangerouslySetInnerHTML={{__html: element.body}}/>
                            </div>)
                    })
            }
        )
    }

    render() {
        return (
            <ListGroup>
                {this.state.data}
            </ListGroup>
        )
    }
}

export default ReplyPopoverContent;
