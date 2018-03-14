import React, {Component} from 'react';
import {Popover, ListGroupItem, Media, OverlayTrigger, ProgressBar, Button} from 'react-bootstrap';
import ReplyPopoverContent from "./ReplyPopoverContent"
import Rules from "./Rules";

class ThreadItem extends Component {
    constructor(props) {
        super(props);
        this.highlightReplies = this.highlightReplies.bind(this);
        this.replyClick = this.replyClick.bind(this);
    }

    replyClick() {
        alert("Пока не работает")
    }

    highlightReplies(text) {
        var re = new RegExp('(>>\\d+)', 'gi');
        var result;
        var arrayMatches = text.match(re);
        if (arrayMatches) {
            result =
                <OverlayTrigger
                    container={this.refs.dest}
                    trigger="hover"
                    placement="bottom"
                    overlay={
                        <Popover style={{maxWidth: "70%"}} title="Reply to">
                            <ReplyPopoverContent replies={arrayMatches}/>
                        </Popover>
                    }
                >
                    <div ref={"dest"} style={{width: "80%"}} dangerouslySetInnerHTML={{__html: text}}/>
                </OverlayTrigger>
        }
        else {
            result = <div style={{width: "80%"}} dangerouslySetInnerHTML={{__html: text}}/>
        }
        return result;
    }

    render() {
        const styles = {
            replyBtn: {
                float: "right"
            }
        }
        var element = this.props.element;
        var threadView = <ListGroupItem><ProgressBar active now={45}/></ListGroupItem>
        if (element) {
            //console.log(element)
            return (<div>
                <ListGroupItem id={element.post_id}>
                    {element.image_id ?
                        <Media.Left align="top">
                            {
                                element.content_type === "video/webm" ?
                                    <img width={200} class="videoThumbnail"
                                         src={"/thumb/" + element.image_id}
                                         alt="video"
                                         onClick={() => this.props.mediaClick("video", element.image_id)}/> :
                                    <img width={200}
                                         src={"/thumb/" + element.image_id}
                                         alt="image"
                                         onClick={() => this.props.mediaClick("image", element.image_id)}/>
                            }
                        </Media.Left> :
                        <div/>
                    }
                    <Media.Body>
                        <Media.Heading>
                            {element.creation_time + " #" + element.post_id}
                            <Button bsStyle="link" style={styles.replyBtn} onClick={this.replyClick}>
                                Reply
                            </Button>
                        </Media.Heading>
                        <div>
                            {this.highlightReplies(element.body)}
                        </div>
                    </Media.Body>
                </ListGroupItem>
                <Rules/>
            </div>)
        }
        else {
            return (
                <div>
                    <ProgressBar active now={45}/>
                    <Rules/>
                </div>
            )
        }
    }
}

export default ThreadItem;
