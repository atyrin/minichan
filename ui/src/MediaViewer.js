import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

class MediaViewer extends Component {
    constructor(props) {
        super(props);
    }

    handleClose() {
        this.props.handleClose()
    }


    render() {
        const styles = {
            imageStyle: {
                width: "100%"
            },
            videoStyle: {
                width: "100%"
            }
        };
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.handleClose}
                bsSize="large"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        MediaContent
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        this.props.contentType === "video" ?
                            <video
                                src={"/img/" + this.props.contentUrl}
                                preload="none"
                                poster={"/thumb/" + this.props.contentUrl}
                                style={styles.videoStyle}
                                controls
                                autoplay>
                            </video> :
                            <img
                                src={"/img/" + this.props.contentUrl}
                                style={styles.imageStyle}
                                alt="image"/>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default MediaViewer;
