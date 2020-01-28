import React from 'react';
import {Link} from 'react-router-dom';

function TeamNotFound(props) {
    return (
        <section className="section" style={{textAlign: 'center'}}>
            <div className="container">
                <h1 className="title">Team Not Found</h1>
                <Link to="/" className="button is-primary">Back to Home</Link>
            </div>
        </section>
    );
}

export default TeamNotFound;