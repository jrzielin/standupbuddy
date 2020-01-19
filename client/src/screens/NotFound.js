import React from 'react';
import { Link } from 'react-router-dom';

function NotFound(props) {
    document.title = 'Standup Buddy | 404 Not Found';

    return (
        <section className="section">
            <div className="container" style={{ textAlign: 'center' }}>
                <h1 className="title">404 Not Found</h1>
                <p className="subtitle">Could not find the page you are looking for.</p>
                <p><Link to="/" className="button is-primary">Home</Link></p>
            </div>
        </section>
    );
}

export default NotFound;