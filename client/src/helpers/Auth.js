const Auth = {
    isAuthenticated: localStorage.getItem('token') !== null ? true : false,
    authenticate(cb) {
        // Need to ping /login api endpoint and store jwt in local storage
        this.isAuthenticated = true;
        cb();
    },
    signout(cb) {
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        cb();
    }
}

export default Auth;