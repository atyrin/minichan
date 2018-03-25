import React, {Component} from 'react';
import {Popover, OverlayTrigger} from 'react-bootstrap';
import ReplyPopoverContent from "./ReplyPopoverContent"

class PrettifyText extends Component {
    constructor(props) {
        super(props);
        this.highlightReplies = this.highlightReplies.bind(this);
    }

    highlightReplies() {
        var text = this.props.text;
        var re = new RegExp('(>>\\d+)', 'gi');
        var result = [];
        var arrayMatches = text.match(re);
        if (arrayMatches) {
            arrayMatches.forEach(
                (element, index) => {
                    let reindex = text.search(re);
                    let before = text.substring(0, reindex);
                    result.push(<span dangerouslySetInnerHTML={{__html: before + " "}}/>)
                    result.push(
                        <OverlayTrigger
                            container={this.refs.dest}
                            containerPadding={20}
                            trigger="hover"
                            placement="bottom"
                            overlay={
                                <Popover style={{maxWidth: "70%"}}>
                                    <ReplyPopoverContent replies={[element]}/>
                                </Popover>
                            }
                        >
                            <a>{element}</a>
                        </OverlayTrigger>
                    );
                    text = text.substring(reindex + element.length)
                }
            );
            result.push(<span dangerouslySetInnerHTML={{__html: " " + text}}/>);

        }
        else {
            result = <div style={{display: "inline-block"}} dangerouslySetInnerHTML={{__html: text}}/>
        }
        return result;
    }

    render() {
        return (
            <p>
                {this.highlightReplies()}
            </p>
        )
    }
}

export default PrettifyText;
