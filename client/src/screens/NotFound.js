import React, { Component } from 'react';
import { Link } from 'react-router-dom';

function NotFound() {

    document.title = 'Standup Buddy | 404 NOT FOUND';

    return (
        <section className="section" style={{ textAlign: 'center' }}>
            <div className="container">
                <h1 className="title">404 NOT FOUND</h1>
                <p className="subtitle">The page you are trying to reach does not exist.</p>
                <div>
                    <Link className="button is-primary" to="/">Home</Link>
                </div>
            </div>
        </section>
    );
}

export default NotFound;