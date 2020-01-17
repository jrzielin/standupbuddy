import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import NewTeam from '../components/NewTeam';
import { Link } from 'react-router-dom';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            loading: true,
            newTeam: false,
            newTeamName: ''
        };
    }

    componentDidMount() {
        document.title = 'Standup Buddy | Home';
        this.fetchTeams();
    }

    fetchTeams = () => {
        fetch('/api/teams?mine=true', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(res => this.setState({teams: res.teams, loading: false, newTeam: false, newTeamName: ''}))
        .catch(err => alert('Unable to query teams'));
    }

    handleClick = (e) => {
        this.setState({newTeam: true});
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if(!this.state.newTeamName) return;
        
        fetch('/api/teams', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name: this.state.newTeamName
            })
        })
        .then(res => res.json())
        .then(res => this.fetchTeams())
        .catch(err => console.log(err));
    }

    handleChange = (e) => {
        this.setState({
            newTeamName: e.target.value
        });
    }

    handleClose = (e) => {
        this.setState({
            newTeam: false
        });
    }

    render() {
        return (
            <div>
                <Navbar authenticated={true} />
                {this.state.newTeam &&
                    <NewTeam 
                        onSubmit={this.handleSubmit}
                        onChange={this.handleChange}
                        name={this.state.newTeamName}
                        close={this.handleClose}
                    />
                }
                <section className="section">
                    <div className="container">
                        <h1 className="title" style={{textAlign: 'center'}}>Home</h1>
                        {!this.state.loading && !this.state.teams.length && 
                            <div style={{ textAlign: 'center' }}>
                                <div>Looks like you haven't set up any teams yet!</div>
                                <div style={{ marginTop: '20px' }}>
                                    <button type="button" className="button is-primary" onClick={this.handleClick}>Create a Team</button>
                                </div>
                            </div>
                        }
                        {!this.state.loading && this.state.teams.length &&
                            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                <button type="button" className="button is-primary" onClick={this.handleClick}>Create a Team</button>
                            </div>
                        }
                        <div>
                            <table className="table" style={{width: '100%'}}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Team</th>
                                        <th>Owner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.teams.map((team, i) => {
                                        return (
                                            <tr key={i} className="team-row">
                                                <td>{i + 1}</td>
                                                <td>
                                                    <Link to={{pathname: `/teams/${team.id}`}}>
                                                        {team.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link to={{pathname: `/users/${team.owner_id}`}}>
                                                        {team.first_name} {team.last_name}
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}