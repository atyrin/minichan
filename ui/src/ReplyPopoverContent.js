import React, {Component} from 'react';
import {Popover, Media, ListGroup, ProgressBar} from 'react-bootstrap';
import ThreadItem from "./ThreadItem"

class ReplyPopoverContent extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
        this.mediaClick = this.mediaClick.bind(this);
    }

    componentDidMount() {
        console.log("Mount ReplyPopover");
        setTimeout(this.loadReplies(), 1000);
    }

    mediaClick() {
        console.log("Non permit view content from popover");
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
                        this.state.data.push(<ThreadItem element={element} mediaClick={this.mediaClick}/>)
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
