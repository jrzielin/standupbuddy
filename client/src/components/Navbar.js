import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import Auth from '../helpers/Auth';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            burgerClass: 'navbar-burger burger',
            menuClass: 'navbar-menu',
            isActiveDropdown: false,
            dropdownClass: 'dropdown',
            teams: []
        };
    }

    componentDidMount = () => {
        if(!this.props.authenticated) {
            return;
        }

        fetch('/api/teams?mine=true', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(response => {
            this.setState({
                teams: response.teams
            });
        })
        .catch(error => {
            alert('Unable to pull teams');
        });
    }

    logout = (e) => {
        Auth.signout(() => this.props.history.push('/login'));
    }

    toggleMenu = (e) => {
        if(this.state.burgerClass === 'navbar-burger burger') {
            this.setState({burgerClass: 'navbar-burger burger is-active'});
        }
        else {
            this.setState({burgerClass: 'navbar-burger burger'});
        }

        if(this.state.menuClass === 'navbar-menu') {
            this.setState({menuClass: 'navbar-menu is-active'});
        }
        else {
            this.setState({menuClass: 'navbar-menu'});
        }        
    }

    handleDropdown = (e) => {
        const isActiveDropdown = this.state.isActiveDropdown;
        if(!isActiveDropdown) {
            this.setState({
                isActiveDropdown: true,
                dropdownClass: 'dropdown is-active'
            });
        }
        else {
            this.setState({
                isActiveDropdown: false,
                dropdownClass: 'dropdown'
            });
        }
    }

    render() {
        return (
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link className="navbar-item" to="/">
                        Standup Buddy
                    </Link>
                    <a role="button" className={this.state.burgerClass} onClick={this.toggleMenu} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" className={this.state.menuClass}>
                    <div className="navbar-start" />
                    <div className="navbar-end">
                    <div className="navbar-item">
                        { this.props.authenticated && 
                            <div className="buttons">
                                <div className={this.state.dropdownClass} style={{marginRight: '10px'}}>
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={this.handleDropdown}>
                                        <span>Teams</span>
                                        <span className="icon is-small">
                                            <i className="fas fa-angle-down" aria-hidden="true"></i>
                                        </span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            <Link to="/items" className="dropdown-item">
                                                Personal
                                            </Link>
                                            {this.state.teams.map(team => {
                                                return (
                                                    <Link key={team.id} to={`/teams/${team.id}`} className="dropdown-item">
                                                        {team.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <button className="button is-light" onClick={this.logout}>
                                    Log out
                                </button>
                            </div>
                        }
                        { !this.props.authenticated && 
                            <div className="buttons">
                                <Link className="button is-primary" to="/signup">
                                    <strong>Sign up</strong>
                                </Link>
                                <Link className="button is-light" to="/login">
                                    Log in
                                </Link>
                            </div>
                        }
                    </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default withRouter(Navbar);