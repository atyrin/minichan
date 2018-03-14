import React, {Component} from 'react';
import {Panel, FormGroup, FormControl, ControlLabel, HelpBlock, Button, Table} from 'react-bootstrap';

class ModerationPage extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.removePost = this.removePost.bind(this);

        this.state = {
            value: '',
            postDetails: ''
        };
    }

    submitForm() {
        this.setState({current: this.state.value})
        fetch("/api/post/" + this.state.value)
            .then(response => response.json())
            .then(json => this.handlePreview(json))
    }

    handlePreview(json) {
        console.log(json);
        var table =
            <div>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>Поле</th>
                        <th>Значение</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>ID записи</td>
                        <td>{json["post_id"]}</td>
                    </tr>
                    <tr>
                        <td>Тип записи</td>
                        <td>{json["_cls"]}</td>
                    </tr>
                    <tr>
                        <td>Subject</td>
                        <td>{json["subject"]}</td>
                    </tr>
                    <tr>
                        <td>Body</td>
                        <td>{json["body"]}</td>
                    </tr>
                    <tr>
                        <td>Дата создания</td>
                        <td>{json["creation_time"]}</td>
                    </tr>
                    <tr>
                        <td>Тип аттача</td>
                        <td>{json["image_id"]}</td>
                    </tr>
                    </tbody>
                </Table>
                <Button onClick={this.removePost} bsStyle="danger">Удалить</Button>
            </div>
        this.setState({postDetails: table})
    }

    removePost() {
        fetch("/api/moderate/" + this.state.current, {method: "DELETE"})
            .then(response => response.json())
            .then(json => console.log(json))
    }


    handleChange(e) {
        this.setState({value: e.target.value});
    }

    render() {
        const styles = {
            formStyle: {
                width: "70%",
                margin: "auto"
            },
            textbox: {
                width: "80%",
                marginRight: "10px"
            },
            inputStyle: {
                display: "flex"
            }
        };
        if (this.state.postDetails) {
            var table = this.state.postDetails;
        }
        else {
            table = <div/>
        }
        return (
            <Panel style={styles.formStyle} bsStyle="warning">
                <Panel.Heading>
                    <Panel.Title componentClass="h3">Панель модерации</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <FormGroup
                        controlId="formBasicText"
                    >
                        <ControlLabel>Введите номер поста</ControlLabel>
                        <div style={styles.inputStyle}>
                            <FormControl
                                style={styles.textbox}
                                type="text"
                                value={this.state.value}
                                placeholder="Enter text"
                                onChange={this.handleChange}

                            />
                            <Button onClick={this.submitForm} bsStyle="success">Открыть</Button>
                        </div>
                        <HelpBlock>После ввода нажмите клавишу Enter.</HelpBlock>
                    </FormGroup>
                    {table}
                </Panel.Body>
            </Panel>
        )
    }
}

export default ModerationPage;
