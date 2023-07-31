import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { useEffect, useState } from 'react';
import { useMUD } from '../../MUDContext';

export const UserNameModal = () => {
    const { setUserName, userName, saveUserName } = usePlayer();
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
            saveUserName();
            if (tx == null) {
                console.log("joinGame encounter an error!.")
                return
            }

        }
    }
    return (
        <div className="modal fade"
            id="userNameModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="userNameModalLabel"
            aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-white">
                    <div className="modal-header justify-center">
                        <h1 className="modal-title text-2xl" id="userNameModalLabel">Username</h1>
                    </div>
                    <div className="modal-body">
                        {
                            !localStorage.getItem('username')
                                ? <input onChange={(e: any) => handleInput(e)} type="text" className="form-control" id="usernameinput" placeholder="Please enter your username" />
                                : <input defaultValue={userName} type="text" className="form-control" id="usernameinput" readOnly />
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-dark border-white" data-bs-dismiss="modal">Close</button>
                        {
                            disable ? <JoinToGameButton disable={disable} /> :
                                (
                                    <Link to={'/game'}>
                                        <JoinToGameButton onClick={() => onClick()} disable={disable} />
                                    </Link>
                                )
                        }
                    </div>
                </div>
            </div >
        </div >
    )
}


const JoinToGameButton = ({ disable, onClick }: any) => {
    return <button
        disabled={disable}
        onClick={onClick}
        type="button"
        className="btn btn-dark border-white"
        data-bs-dismiss="modal">
        Join to the Game
    </button>
}
