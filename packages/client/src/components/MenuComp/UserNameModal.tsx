import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { useEffect, useState } from 'react';
import { useMUD } from '../../MUDContext';

export const UserNameModal = () => {
    const { setUserName, userName } = usePlayer();
    const { systemCalls } = useMUD()
    const [disable, setDisable] = useState<boolean>(true);

    useEffect(() => {
        if (localStorage.getItem('username')) {
            setDisable(false)
        }
    }, [userName])

    const handleInput = (e: any) => {
        setUserName(e.target.value)
        if (e.target.value.length > 2 && e.target.value.length < 32) {
            setDisable(false)
        }
        else {
            setDisable(true)
        }
    }
    const onClick = async () => {
        if (!localStorage.getItem("username")) {
            const tx = await systemCalls.joinGame(userName!, 1);

            if (tx == null) {
                console.log("joinGame encounter an error!.")
                return
            }

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
                            {
                                !localStorage.getItem('username')
                                    ? <input onChange={(e: any) => handleInput(e)} type="text" className="form-control w-75" id="usernameinput" placeholder="username" />
                                    : <input value={userName} type="text" className="form-control w-75" id="usernameinput" readOnly />
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        {
                            disable ? <JoinToGameButton disable={disable} /> :
                                (<Link to={'/game'}>
                                    <JoinToGameButton onClick={() => onClick()} disable={disable} />
                                </Link>)
                        }
                    </div>
                </div>
            </div >
        </div >
    )
}


const JoinToGameButton = ({ disable, onClick }: any) => {
    return <button disabled={disable} onClick={onClick} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Join to the Game</button>
}
