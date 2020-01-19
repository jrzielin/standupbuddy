import React from 'react';

function NewTeam(props) {
    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={props.close}></div>
            <div className="modal-content">
                <div className="box">
                    <h1 className="title">New Team</h1>
                    <form onSubmit={props.onSubmit} style={{textAlign: 'left'}}>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input className="input" type="text" value={props.newTeamName} onChange={props.onChange} autoFocus />
                            </div>
                        </div>
                        <div className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-primary">Submit</button>
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

export default NewTeam;