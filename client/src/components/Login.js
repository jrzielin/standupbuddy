import React, {Component} from 'react';
import Navbar from './Navbar';
import Auth from '../helpers/Auth';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            incorrect: false,
            message: '',
            isLoading: false,
        };
    }

    componentDidMount() {
        document.title = 'Standup Buddy | Login';
    }

    handleChange = (e) => {
        if(e.target.id === 'email') {
            this.setState({email: e.target.value});
        }

        if(e.target.id === 'password') {
            this.setState({password: e.target.value});
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({isLoading: true});

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        .then(response => response.json())
        .then(response => {
            this.setState({
                isLoading: false
            });
            
            if(response.hasOwnProperty('token')) {
                localStorage.setItem('token', response.token);
                Auth.authenticate(() => this.props.history.push('/'));
            }
            else if(response.hasOwnProperty('error')) {
                this.setState({
                    incorrect: true,
                    message: response.error
                });
            }
            else if(response.hasOwnProperty('message')) {
                this.setState({
                    incorrect: true,
                    message: response.message
                });
            }
            else {
                this.setState({
                    incorrect: true,
                    message: 'Unable to authenticate'
                });
            }
        })
        .catch(error => {
            this.setState({
                incorrect: true,
                message: 'An unexpected error occurred',
                isLoading: false
            });
        });
    }

    closeMessage = (e) => {
        this.setState({
            incorrect: false,
            message: ''
        });
    }

    render() {
        const styles = {
            card: {
                maxWidth: '30rem',
                marginLeft: 'auto',
                marginRight: 'auto'
            },
            button: {
                width: '100%'
            }
        };

        const btnClass = this.state.isLoading ? 'button is-primary is-loading' : 'button is-primary';

        return (
            <div>
                <Navbar authenticated={false} />
                <section className="section">
                    <div className="container">
                        <div className="card" style={styles.card}>
                            <div className="card-header">
                                <p className="card-header-title is-centered">Login</p>
                            </div>
                            <div className="card-content">
                                {this.state.incorrect && 
                                    <div className="notification is-danger">
                                        <button className="delete" onClick={this.closeMessage} />
                                        {this.state.message}
                                    </div>
                                }
                                <form onSubmit={this.handleSubmit}>
                                    <div className="field">
                                        <div className="label">Email</div>
                                        <div className="control">
                                            <input className="input" id="email" type="email" value={this.state.email} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="label">Password</div>
                                        <div className="control">
                                            <input className="input" id="password" type="password" value={this.state.password} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <button className={btnClass} style={styles.button} type="submit">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Login;