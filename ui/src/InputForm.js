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
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleBoldButton = this.handleBoldButton.bind(this);
        this.handleItalicButton = this.handleItalicButton.bind(this);
        this.handleUnderlineButton = this.handleUnderlineButton.bind(this);
        this.handleSpoilerButton = this.handleSpoilerButton.bind(this);
        this.handleStrikethroughButton = this.handleStrikethroughButton.bind(this);
        this.handleHighlightButton = this.handleHighlightButton.bind(this);
        this.handleLinkButton = this.handleLinkButton.bind(this);

        this.handleStyleButton = this._handleStyleButton.bind(this);
        this.state = {text: ""};
    }

    _handleStyleButton(type1, type2) {
        let textVal = this.refs.myTextarea;
        let selectionStart = textVal.selectionStart;
        let selectionEnd = textVal.selectionEnd;
        let newVal = this.state.text.substring(0, selectionStart) + type1 +
            this.state.text.substring(selectionStart, selectionEnd) + type2 +
            this.state.text.substring(selectionEnd);
        this.setState({text: newVal})
    }

    handleBoldButton() {
        this._handleStyleButton("[strong]", "[/strong]")
    }

    handleItalicButton() {
        this._handleStyleButton("[italic]", "[/italic]")
    }

    handleUnderlineButton() {
        this._handleStyleButton("[underline]", "[/underline]")
    }

    handleSpoilerButton() {
        this._handleStyleButton("[spoiler]", "[/spoiler]")
    }

    handleStrikethroughButton() {
        this._handleStyleButton("[strikethrough]", "[/strikethrough]")
    }

    handleHighlightButton() {
        this._handleStyleButton("[highlight]", "[/highlight]")
    }

    handleLinkButton() {
        this._handleStyleButton("[link]", "[/link]")
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
            },
            subjectStyle: {
                float: "left",
                width: "100%",
                border: "3px solid #cccccc",
                padding: "5px",
                fontFamily: "Tahoma, sans-serif",
                marginBottom: "5px",
            }
        };

        const locals = {};
        if (this.props.page === "main") {
            locals.formLink = "api/threads";
            locals.showSubject = true;
            locals.subjectPlaceholder = "сабж";
            locals.textPlaceholder = "Введите свой текст";
            locals.inputHeader = "Добавить новый пост";
            locals.fileInput = <input type="file"
                                      name="file"
                                      accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*, .webm"
                                      required/>;
        }
        else {
            locals.formLink = "api/thread/" + this.props.thread;
            locals.showSubject = false;
            locals.subjectPlaceholder = "сабж";
            locals.textPlaceholder = "Введите свой текст";
            locals.inputHeader = "Ответить в тред";
            locals.fileInput = <input type="file"
                                      name="file"
                                      accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*, .webm"
            />;
        }

        return (
            <Panel style={styles.all} id="collapsible-panel-example-2">
                <Panel.Heading>
                    <Panel.Title style={styles.header} toggle>
                        {locals.inputHeader}
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Collapse>
                    <Panel.Body>
                        <form action={locals.formLink} method="post" enctype="multipart/form-data">
                            <FormGroup controlId="formControlsTextarea">
                                <ControlLabel>Ваше сообщение</ControlLabel>
                                {locals.showSubject ?
                                    <input
                                        type="text"
                                        name="subject"
                                        style={styles.subjectStyle}
                                        maxlength="20"
                                        placeholder={locals.subjectPlaceholder}
                                        required/> :
                                    <div/>
                                }
                                <textarea
                                    type="text"
                                    name="body"
                                    style={styles.textAreaStyle}
                                    placeholder={locals.textPlaceholder}
                                    onChange={this.handleTextChange}
                                    value={this.state.text}
                                    ref="myTextarea"
                                    maxlength="1000"
                                    required/>
                            </FormGroup>
                            <ButtonGroup>
                                <Button onClick={this.handleBoldButton}><span class="strong">B</span></Button>
                                <Button onClick={this.handleItalicButton}><span class="italic">I</span></Button>
                                <Button onClick={this.handleUnderlineButton}><span class="underline">U</span></Button>
                                <Button onClick={this.handleSpoilerButton}><span class="spoiler">S</span></Button>
                                <Button onClick={this.handleStrikethroughButton}><span
                                    class="strikethrough">S</span></Button>
                                <Button onClick={this.handleHighlightButton}><span class="highlight">H</span></Button>
                                <Button onClick={this.handleLinkButton}><span class="underline">http://</span></Button>
                            </ButtonGroup>
                            {locals.fileInput}
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
