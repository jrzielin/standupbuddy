import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import NewTeam from '../components/Team/NewTeam';
import EditTeam from '../components/Team/EditTeam';
import DeleteTeam from '../components/Team/DeleteTeam';
import { Link } from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            loading: true,
            newTeam: false,
            newTeamName: '',
            editTeam: null,
            deleteTeam: null
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
        .then(res => this.setState({teams: res.teams, loading: false, newTeam: false, newTeamName: '', editTeam: null, deleteTeam: null}))
        .catch(err => console.log(err));
    }

    createTeam = (e) => {
        this.setState({newTeam: true});
    }

    handleCreateSubmit = (e) => {
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
        .then(res => this.fetchTeams())
        .catch(err => console.log(err));
    }

    handleCreateChange = (e) => {
        this.setState({
            newTeamName: e.target.value
        });
    }

    handleClose = (e) => {
        this.setState({
            newTeam: false,
            deleteTeam: null,
            editTeam: null
        });
    }

    editTeam = (e, team) => {
        this.setState({editTeam: Object.assign({}, team)});
    }

    deleteTeam = (e, team) => {
        this.setState({deleteTeam: team});
    }

    handleEditChange = (e) => {
        let team = this.state.editTeam;
        team.name = e.target.value;
        this.setState({editTeam: team});
    }

    handleEditSubmit = (e) => {
        e.preventDefault();
        if(!this.state.editTeam.name) return;

        const team = this.state.editTeam;

        fetch(`/api/teams/${team.id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                name: team.name
            })
        })
        .then(res => this.fetchTeams())
        .catch(err => console.log(err));
    }

    handleDeleteSubmit = (e) => {
        e.preventDefault();
        const team = this.state.deleteTeam;

        fetch(`/api/teams/${team.id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        })
        .then(res => this.fetchTeams())
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                <Navbar authenticated={true} />
                {this.state.newTeam &&
                    <NewTeam 
                        onSubmit={this.handleCreateSubmit}
                        onChange={this.handleCreateChange}
                        name={this.state.newTeamName}
                        close={this.handleClose}
                    />
                }
                {this.state.editTeam && 
                    <EditTeam 
                        onSubmit={this.handleEditSubmit}
                        onChange={this.handleEditChange}
                        close={this.handleClose}
                        team={this.state.editTeam}
                    />
                }
                {this.state.deleteTeam &&
                    <DeleteTeam 
                        onSubmit={this.handleDeleteSubmit}
                        close={this.handleClose}
                        team={this.state.deleteTeam}
                    />
                }
                <section className="section">
                    <div className="container">
                        <h1 className="title" style={{textAlign: 'center'}}>Home</h1>
                        {!this.state.loading && !this.state.teams.length && 
                            <div style={{ textAlign: 'center' }}>
                                <div>Looks like you haven't set up any teams yet!</div>
                                <div style={{ marginTop: '20px' }}>
                                    <button type="button" className="button is-primary" onClick={this.createTeam}>Create a Team</button>
                                </div>
                            </div>
                        }
                        {!this.state.loading && this.state.teams.length &&
                            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                <button type="button" className="button is-primary" onClick={this.createTeam}>Create a Team</button>
                            </div>
                        }
                        <div>
                            <table className="table" style={{width: '100%'}}>
                                <thead>
                                    <tr>
                                        <th>Team</th>
                                        <th>Owner</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.teams.map((team, i) => {
                                        return (
                                            <tr key={i} className="team-row">
                                                <td>
                                                    <Link to={{pathname: `/teams/${team.id}`}} style={{color: 'inherit'}}>
                                                        {team.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {team.first_name} {team.last_name}
                                                </td>
                                                <td>
                                                    <span className="icon is-small" style={{marginRight: '5px'}} onClick={(e) => this.editTeam(e, team)}>
                                                        <i className="fas fa-pencil-alt" />
                                                    </span>
                                                    <span className="icon is-small" onClick={(e) => this.deleteTeam(e, team)}>
                                                        <i className="fas fa-trash" />
                                                    </span>
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

export default Home;