import React from 'react';

function DateStepper(props) {
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
            <span style={styles.padRight} onClick={props.backwardStep} className="hoverable">
                <i className="fas fa-arrow-left" />
            </span>
            <span>{props.prettyDate}</span>
            <span style={styles.padLeft} onClick={props.forwardStep} className="hoverable">
                <i className="fas fa-arrow-right" />
            </span>
        </h1>
    );
}

export default DateStepper;