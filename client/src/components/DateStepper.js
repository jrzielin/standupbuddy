import React, {Component} from 'react';

class DateStepper extends Component {
    render() {
        const styles = {
            title: {
                textAlign: 'center',
                fontSize: '1rem'
            },
            padRight: {
                paddingRight: '10px'
            },
            padLeft: {
                paddingLeft: '10px'
            }
        };

        return (
            <h1 className="title" style={styles.title}>
                <span style={styles.padRight} onClick={this.props.backwardStep} className="hoverable">
                    <i className="fas fa-arrow-left" />
                </span>
                <span>{this.props.prettyDate}</span>
                <span style={styles.padLeft} onClick={this.props.forwardStep} className="hoverable">
                    <i className="fas fa-arrow-right" />
                </span>
            </h1>
        );
    }
}

export default DateStepper;