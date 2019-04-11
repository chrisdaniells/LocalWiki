import React from 'react';
import { withRouter } from 'react-router-dom';

class BackButton extends React.Component {
    constructor(props) {
        super(props);
    }

    onBackClick() {
        if (this.props.override) {
            this.props.history.push({
                pathname: this.props.override
            });
        } else {
            this.props.history.goBack();
        }
    }

    render() {
        return(
            <div>
                <div style={{ textAlign: "right" }}>
                    <button 
                        className="StyledButton"
                        onClick={this.onBackClick.bind(this)}
                    >{this.props.label}</button>
                </div>
                <div className="u-div"></div>
            </div>
        )
    }
}

export default withRouter(BackButton);