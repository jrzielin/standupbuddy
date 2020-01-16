import React, { Component } from 'react';
import Navbar from '../components/Navbar';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            loading: true
        };
    }

    componentDidMount() {
        document.title = 'Standup Buddy | Home';
        fetch('/api/teams?mine=true', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(res => this.setState({teams: res.teams, loading: false}))
        .catch(err => alert('Unable to query teams'));
    }

    render() {
        return (
            <div>
                <Navbar authenticated={true} />
                <section className="section">
                    <div className="container">
                        <h1 className="title" style={{textAlign: 'center'}}>Home</h1>
                        {!this.state.loading && !this.state.teams.length && 
                            <div style={{ textAlign: 'center' }}>
                                <div style={{textAlign: 'center'}}>Looks like you haven't set up any teams yet!</div>
                                <p style={{ marginTop: '20px' }}><button type="button" className="button is-primary">Create a Team</button></p>
                            </div>
                        }
                        <div>
                            {this.state.teams.map(team => {
                                return (
                                    <div>{team.name}</div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Home;