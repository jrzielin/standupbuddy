import React, { Component } from 'react';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: []
        };
    }

    componentDidMount() {
        document.title = 'Standup Buddy | Home';
        this.getTeams();
    }

    getTeams = () => {
        fetch('/api/teams')
        .then(res => res.json())
        .then(res => this.setState({teams: res.teams}));
    }

    // foo baz

    render() {
        return (
            <section className="section">
                <div className="container">
                    <h1 className="title">Home Screen</h1>
                    { this.state.teams.map(team => {
                        return (
                            <div>{team.name}</div>
                        );
                    }) }
                </div>
            </section>
        );
    }
}

export default Home;