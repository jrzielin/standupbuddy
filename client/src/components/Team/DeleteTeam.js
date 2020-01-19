import React from 'react';

function DeleteTeam(props) {
    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={props.close}></div>
            <div className="modal-content">
                <div className="box">
                    <h1 className="title">Delete {props.team.name}?</h1>
                    <form onSubmit={props.onSubmit} style={{textAlign: 'left'}}>
                        <div className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-danger">Delete</button>
                            </div>
                            <div className="control">
                                <button type="button" className="button" onClick={props.close}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <button className="modal-close is-large" onClick={props.close}></button>
        </div>
    );
}

export default DeleteTeam;