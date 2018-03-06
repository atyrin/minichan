import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

class MediaViewer extends Component {
    constructor(props) {
        super(props);
        this.zoomer = this.zoomer.bind(this);
        this.state = {modal: 868}
    }

    zoomer(e) {

    }


    render() {
        const styles = {
            imageStyle: {
                maxWidth: "100%",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
            },
            videoStyle: {
                maxWidth: "100%"
            }
        };
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.handleClose}
                bsSize="large"
            >
                <Modal.Body
                    id={"myModal"}
                >
                    {
                        this.props.contentType === "video" ?
                            <video
                                style={styles.imageStyle}
                                controls
                                autoplay="autoplay"
                            >
                                <source src={"/img/" + this.props.contentUrl} type='video/webm; codecs="vp8, vorbis"'/>
                            </video> :
                            <img
                                onWheel={this.zoomer}
                                src={"/img/" + this.props.contentUrl}
                                style={styles.imageStyle}
                                alt="image"/>
                    }
                </Modal.Body>
            </Modal>
        )
    }
}

export default MediaViewer;
