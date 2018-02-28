import React, {Component} from 'react';
import {Panel, PanelGroup} from 'react-bootstrap';

class InputForm extends Component {
    constructor(props) {
        super(props);
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
            }
        }
        return (
            <Panel style={styles.all} id="collapsible-panel-example-2">
                <Panel.Heading>
                    <Panel.Title style={styles.header} toggle>
                        Добавить новый пост
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Collapse>
                    <Panel.Body>
                        Тут будет поле для ввода, кнопочки форматирования, возможность залить файл или приаттачить видос
                        с ютуба
                    </Panel.Body>
                </Panel.Collapse>
            </Panel>
        )
    }
}

export default InputForm;
