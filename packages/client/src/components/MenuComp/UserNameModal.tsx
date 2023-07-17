import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { useState } from 'react';

export const UserNameModal = () => {
    const { setUserName } = usePlayer();
    const [disable, setDisable] = useState<boolean>(true);

    const handleInput = (e: any) => {
        setUserName(e.target.value)
        if (e.target.value.length > 2) {
            setDisable(false)
        }
        else {
            setDisable(true)
        }
    }
    return (
        <div className="modal fade" id="userNameModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-white">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="userNameModalLabel">Please enter your username</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="usernameinput" className="form-label">Username</label>
                            <input onChange={(e: any) => handleInput(e)} type="text" className="form-control w-75" id="usernameinput" placeholder="username" />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        {
                            disable ? <JoinToGameButton disable={disable} /> :
                                (<Link to={'/game'}>
                                    <JoinToGameButton disable={disable} />
                                </Link>)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


const JoinToGameButton = ({ disable }: any) => {
    return <button disabled={disable} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Join to the Game</button>
}
