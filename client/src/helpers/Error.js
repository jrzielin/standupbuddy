const isError = (res) => {
    if(res.hasOwnProperty('error')) {
        return true;
    }
    else {
        return false;
    }
}

export default isError;