import React, {Component} from 'react';
import {Popover, OverlayTrigger, ListGroup, ListGroupItem, Media} from 'react-bootstrap';
import InputForm from "./InputForm"
import MediaViewer from "./MediaViewer"

class Thread extends Component {
    constructor(props) {
        super(props);
        this.loader = this.loader.bind(this);
        this.parser = this.parser.bind(this);
        this.highlightReplies = this.highlightReplies.bind(this);
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

    highlightReplies(text) {
        var re = new RegExp('(>>\\d+)', 'gi');
        var result;
        var arrayMatches = text.match(re);

        const popoverTop = (
            <Popover id="popover-positioned-scrolling-top" title="Reply to">
                В сообщении есть реплай. Тут будет его текст.
            </Popover>
        );

        if (arrayMatches) {
            result =
                <OverlayTrigger
                    container={this}
                    trigger="hover"
                    placement="top"
                    overlay={popoverTop}
                >
                    <div dangerouslySetInnerHTML={{__html: text}}/>
                </OverlayTrigger>
        }
        else {
            result = <div dangerouslySetInnerHTML={{__html: text}}/>
        }
        return result
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
                <ListGroupItem id={element.post_id}>
                    {element.image_id ?
                        <Media.Left align="top">
                            {
                                element.content_type === "video/webm" ?
                                    <img width={200} class="videoThumbnail"
                                         src={"/thumb/" + element.image_id}
                                         alt="video"
                                         onClick={() => this.mediaClick("video", element.image_id)}/> :
                                    <img width={200}
                                         src={"/thumb/" + element.image_id}
                                         alt="image"
                                         onClick={() => this.mediaClick("image", element.image_id)}/>
                            }
                        </Media.Left> :
                        <div/>
                    }
                    <Media.Body>
                        <Media.Heading>
                            {element.creation_time + " #" + element.post_id}
                        </Media.Heading>
                        <div>
                            {this.highlightReplies(element.body)}
                        </div>
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
                <MediaViewer show={this.state.show} contentType={this.state.contentType}
                             contentUrl={this.state.contentUrl} handleClose={this.handleCloseMediaView}/>
            </div>
        );
    }
}

export default Thread;
