import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

class Rules extends Component {
    constructor(props) {
        super(props);
        this.accept = this.accept.bind(this);
        this.notAccept = this.notAccept.bind(this);
        this.state = {show: true}
    }

    notAccept() {
        let ww = window.open(window.location, '_self');
        ww.close();
    }

    accept() {
        localStorage.setItem("rules", "1");
        this.setState({show: false});
    }

    render() {
        const styles = {
            modalStyle: {
                margin: "auto",
                paddingTop: "150"
            }
        }
        let isAccept = localStorage.getItem("rules");
        if (isAccept === "1") {
            return <div/>
        }
        else {
            return (
                <div>
                    <Modal style={styles.modalStyle} show={this.state.show}>
                        <Modal.Header>
                            <Modal.Title>Правила</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <ol type="1">
                                <li>Вести себя адекватно</li>
                                <li>Не оскорблять коллег</li>
                                <li>Не переходить на личности</li>
                                <li>Быть паинькой</li>
                            </ol>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={this.notAccept} bsStyle="danger">Не принимаю</Button>
                            <Button onClick={this.accept} bsStyle="success">Принимаю</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )
        }
    }
}

export default Rules;
