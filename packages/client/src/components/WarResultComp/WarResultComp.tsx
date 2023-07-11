import { usePlayer } from '../../context/PlayerContext';
import { useWarResult } from '../../hooks/useWarResult';
import { Button } from '@chakra-ui/react';
import warResultIcon from '../../images/warResult.png';

function WarResultComp() {
    const warResults = useWarResult(5);
    const { userWallet } = usePlayer();

    return (
        <div>
            <Button
                style={{
                    zIndex: 1,
                    height: "60px",
                    width: "60px",
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    marginTop: "25px",
                    fontSize: "30px"
                }}
                type="button"
                colorScheme="yellow"
                data-bs-toggle="offcanvas"
                data-bs-target="#warResultModal"
                aria-controls="staticBackdrop">
                <img src={warResultIcon} width={"30px"} height={"30px"}></img>
            </Button>
            <div className="offcanvas offcanvas-end"
                style={{
                    backgroundColor: "rgb(148, 163, 184, 0.5)",
                    height: "240px",
                    marginTop: "95px",
                    marginRight: "5px",
                    borderTop: "2px solid rgb(241, 241, 241)",
                    borderBottom: "2px solid rgb(241, 241, 241)",
                    overflow: "hidden",
                    textAlign: "center",
                    borderRadius: "25px"
                }}
                data-bs-keyboard="false"
                data-bs-backdrop="false"
                id="warResultModal"
                aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header text-center text-white">
                    <h5 className="offcanvas-title border-bottom" id="offcanvasMenuLabel">War Results</h5>
                    <button type="button" className="text-white" data-bs-dismiss="offcanvas" aria-label="Close">X</button>
                </div>
                <div className="offcanvas-body" style={{ overflow: "hidden" }}>
                    {warResults && warResults.data.map((data, key) => {
                        console.log(data)
                        if (data.type === "army") {
                            if (data.data?.isDraw === true) {
                                return <p className='text-white mb-3' key={key}><span className='bg-primary p-2'>You</span> ⚔️ <span className='bg-primary p-2'>Enemy</span> (Draw)</p>
                            }
                            else if (data.data?.winner === userWallet?.address.toLocaleLowerCase()) {
                                return <p className='text-white mb-3' key={key}><span className='bg-success p-2'>You</span> ⚔️ <span className='bg-danger p-2'>Enemy</span> (Win)</p>
                            }
                            else if (data.data?.loser === userWallet?.address.toLocaleLowerCase()) {
                                return <p className='text-white mb-3' key={key}><span className='bg-danger p-2'>You</span> ⚔️ <span className='bg-success p-2'>Enemy</span> (Lose)</p>
                            }
                            return null;
                        }
                        else {
                            if (data.data?.isDraw === true) {
                                return <p className='text-white mb-3' key={key}><span className='bg-primary p-2'>You</span> ⚔️🏰 <span className='bg-primary p-2'>Enemy</span> (Draw)</p>
                            }
                            else if (data.data?.winner === userWallet?.address.toLocaleLowerCase()) {
                                return <p className='text-white mb-3' key={key}><span className='bg-success p-2'>You</span> ⚔️🏰 <span className='bg-danger p-2'>Enemy</span> (Win)</p>
                            }
                            else if (data.data?.loser === userWallet?.address.toLocaleLowerCase()) {
                                return <p className='text-white mb-3' key={key}><span className='bg-danger p-2'>You</span> ⚔️🏰 <span className='bg-success p-2'>Enemy</span> (Lose)</p>
                            }
                            return null;
                        }
                    })}
                </div>
            </div>
        </div>
    )
}

export default WarResultComp