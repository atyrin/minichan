import React, {Component} from 'react';
import {
    Panel,
    PanelGroup,
    FormGroup,
    ControlLabel,
    FormControl,
    Button,
    ButtonGroup,
    DropdownButton,
    MenuItem
} from 'react-bootstrap';

class InputForm extends Component {
    constructor(props) {
        super(props);
        this.validateSubmit = this.validateSubmit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleBoldButton = this.handleBoldButton.bind(this);
        this.handleItalicButton = this.handleItalicButton.bind(this);
        this.handleStyleButton = this._handleStyleButton.bind(this);
        this.state = {text: ""};
    }

    validateSubmit(e) {
        console.log(e);
    }

    _handleStyleButton(type1, type2) {
        let textVal = this.refs.myTextarea;
        let selectionStart = textVal.selectionStart;
        let selectionEnd = textVal.selectionEnd;
        var newVal = this.state.text.substring(0, selectionStart) + type1 +
            this.state.text.substring(selectionStart, selectionEnd) + type2 +
            this.state.text.substring(selectionEnd);
        this.setState({text: newVal})
    }

    handleBoldButton() {
        this._handleStyleButton("[b]", "[/b]")
    }

    handleItalicButton() {
        this._handleStyleButton("[i]", "[/i]")
    }

    handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    render() {
        const styles = {
            all: {
                width: "60%",
                margin: "auto",
                marginBottom: "5px",
            },
            header: {
                textAlign: "center",
            },
            submitStyle: {
                float: "right"
            },
            textAreaStyle: {
                float: "left",
                width: "100%",
                height: "120px",
                border: "3px solid #cccccc",
                padding: "5px",
                fontFamily: "Tahoma, sans-serif",
                marginBottom: "5px",
            }
        };
        return (
            <Panel style={styles.all} id="collapsible-panel-example-2">
                <Panel.Heading>
                    <Panel.Title style={styles.header} toggle>
                        Добавить новый пост
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Collapse>
                    <Panel.Body>
                        <form action="/api/threads" method="post" enctype="multipart/form-data">
                            <FormGroup controlId="formControlsTextarea">
                                <ControlLabel>Ваше сообщение</ControlLabel>
                                <textarea
                                    type="text"
                                    name="body"
                                    style={styles.textAreaStyle}
                                    placeholder="Введите свой текст"
                                    onChange={this.handleTextChange}
                                    value={this.state.text}
                                    ref="myTextarea"/>
                            </FormGroup>
                            <ButtonGroup>
                                <Button onClick={this.handleBoldButton}>Bold</Button>
                                <Button onClick={this.handleItalicButton}>Italic</Button>
                                <DropdownButton title="Attach" id="bg-nested-dropdown">
                                    <MenuItem eventKey="1">Image</MenuItem>
                                    <MenuItem eventKey="2">Webm</MenuItem>
                                </DropdownButton>
                            </ButtonGroup>
                            <input type="file"
                                   name="file"
                                   accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*, .webm"
                                   onChange={(e) => this.validateSubmit(e.target.files)}/>
                            <Button
                                bsStyle="success"
                                type="submit"
                                style={styles.submitStyle}
                                onClick={this.validateSubmit}
                            >
                                Submit
                            </Button>
                        </form>
                    </Panel.Body>
                </Panel.Collapse>
            </Panel>
        )
    }
}

export default InputForm;
