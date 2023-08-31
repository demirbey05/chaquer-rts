import castleSettlementSS from '../../images/tuttorial/castle_settlement_ss.jpg'
import playerSeedSS from '../../images/tuttorial/player_seed_ss.jpg';
import initResourceSS from '../../images/tuttorial/init_resource_ss.jpg';
import gameSS from '../../images/tuttorial/game_ss.jpg';
import marketSS from '../../images/tuttorial/market_ss.jpg';
import armySettleSS from '../../images/tuttorial/army_settle_ss.jpg';
import armySettleModalSS from '../../images/tuttorial/army_settle_modal_ss.jpg';
import armyMoveSS from '../../images/tuttorial/army_move_ss.jpg';
import armyInfoSS from '../../images/tuttorial/army_info_ss.jpg';
import armyAttackSS from '../../images/tuttorial/army_attack_ss.jpg';
import castleCaptureSS from '../../images/tuttorial/castle_capture_ss.jpg';
import warResultSS from '../../images/tuttorial/war_result_ss.jpg';

export const GameTuttorial = () => {
    const tuttorial1Description = "When you arrived to game page, you need first settle your castle position." +
        " Castle position is important for your attack and defence strategies." +
        " By using your castle position, you will be able to deploy your armies." +
        " To settle your castle, choose your position and click the tile." +
        " Then confirm your castle settlement." +
        " Also do not forget, you cannot deploy castle in the mountain and the sea areas."

    const tuttorial2Description = "In player seed stage, we want players to enter number between 1-100." +
        " With seed numbers, we improve your game experience by randomizing resource position.";

    const tuttorial3Description = "When every player enters the player seed, you pass to resource initalize stage." +
        " One of the player in the game must click to Resource Initalize button to deploy resource positions." +
        " When a player deploy the resources, countdown starts from 5 to start the game."

    const tuttorial4Description = "1) This is Settings. You can stop or play the game sound track from here. Also you can go back to menu from here." +
        " 2) This is Army Info. You can see your army details on this area and you can find your armies by clicking 'Find on Map' button." +
        " 3) This is Market. You can sell your resource from here to make credits." +
        " 4) This is Army Progress. You can see that how many army you have on the map." +
        " 5) This is Credit Bar. You can see your credits from here." +
        " 6) This is Resource Progress Bar. You can see that how many resource you have." +
        " 7) This is War Results. You can the results of the war from here." +
        " 8) This is Price List. You can see the live-current prices of resources and armies."

    const tuttorial5Description = "In the market area, you can seel your resources to make credit." +
        " Before selling your resources, do not forget the check resource prices from prices area.";

    const tuttorial6Description = "If you want to settle an army, you need to click one of yours castle." +
        " After clicking one of your castles, you can see the position (orange tiles) where you can deploy your armies .";

    const tuttorial7Description = "When you click to one of the orange tiles, army settlement modal will be opened." +
        " You need to enter your army counts that you want to deploy." +
        " Please be aware of that you should have enough credit to deploy the army." +
        " You can deploy maximum 1500 army at once. That means, you can deploy maximum 500 swordsman, 500 archer and 500 cavalry at once." +
        " Also, if you are going to deploy an army, you need to deploy at least 1 solider."

    const tuttorial8Description = "To move your army, you need to click on your armies." +
        " After you clicked on one of your armies, the blue tiles will be shown." +
        " All you need to do is click one of this blue tile."

    const tuttorial9Description = "With the army info area, you can see your army details." +
        " If you want to find the specific army on the map, you can click on 'Find On Map button'.";

    const tuttorial10Description = "To attack to an army, you need to click on one of your armies." +
        " After you clicked on one of your armies, the blue tiles will be shown." +
        " The army that you will attack to should be in the blue tiles like in army move. If it is not, you cannot attack." +
        " If it is in the blue tiles, you can click on the related enemy army and click 'Attack to the Enemy' button." +
        " Before your attack, be aware of the solider numbers-details. You do not want to lose your war." +
        " This logic is also valid for castle capture and resource capture."

    const tuttorial11Description = "If you are trying to capture a resource or a castle, all you do in army attack is same." +
        " But before you attack, there is logic difference between to attack to an army."; +
            " Castle and Resources are protected from the armies which are in manhattan positions of the castle or resources." +
            " That means that, if the enemy protects its castle or resources more than one army, make a good strategy."

    const tuttorial12Description = "After you have war, you can see the result from war result area." +
        " Blue blocks means, All the armies dead and the result is draw."; +
            " Green blocks means, the related player is winner." +
            " Red blocks means, the related player is loser.";

    return (
        <>
            <TuttorialModal id={1} title={"Castle Settlement"} description={tuttorial1Description} imageSource={castleSettlementSS} />
            <TuttorialModal id={2} title={"Player Seed"} description={tuttorial2Description} imageSource={playerSeedSS} />
            <TuttorialModal id={3} title={"Init Resources"} description={tuttorial3Description} imageSource={initResourceSS} />
            <TuttorialModal id={4} title={"Game Page"} description={tuttorial4Description} imageSource={gameSS} />
            <TuttorialModal id={5} title={"Market"} description={tuttorial5Description} imageSource={marketSS} />
            <TuttorialModal id={6} title={"Army Settlement"} description={tuttorial6Description} imageSource={armySettleSS} />
            <TuttorialModal id={7} title={"Army Settlement - 2"} description={tuttorial7Description} imageSource={armySettleModalSS} />
            <TuttorialModal id={8} title={"Army Move"} description={tuttorial8Description} imageSource={armyMoveSS} />
            <TuttorialModal id={9} title={"Army Info"} description={tuttorial9Description} imageSource={armyInfoSS} />
            <TuttorialModal id={10} title={"Army Attack"} description={tuttorial10Description} imageSource={armyAttackSS} />
            <TuttorialModal id={11} title={"Castle and Resource Capture"} description={tuttorial11Description} imageSource={castleCaptureSS} />
            <TuttorialModal id={12} title={"War Result"} description={tuttorial12Description} imageSource={warResultSS} />
        </>
    )
}

interface TuttorialModalPropTypes {
    id: number,
    title: string,
    description: string,
    imageSource: string
}

const TuttorialModal = (props: TuttorialModalPropTypes) => {
    return (
        <>
            <div className="modal fade" id={`tuttorialModal${props.id}`} aria-hidden="true" aria-labelledby={`tuttorialModal${props.id}Label`} tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content bg-dark text-white">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={`tuttorialModal${props.id}Label`}>Game Tuttorial - {props.title}</h1>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-4 p-2 border-end d-flex align-items-center">
                                        {props.description}
                                    </div>
                                    <div className="col-md-8 p-2">
                                        <img src={props.imageSource} alt={props.title} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {props.id !== 1 && <button className="btn btn-primary w-25" data-bs-target={`#tuttorialModal${props.id - 1}`} data-bs-toggle="modal">Previous Page</button>}
                            <button className="btn btn-primary w-25" data-bs-dismiss={props.id === 12 && "modal"} data-bs-target={props.id !== 12 && `#tuttorialModal${props.id + 1}`} data-bs-toggle={props.id !== 12 && "modal"}>{props.id !== 12 ? "Next Page" : "End Tuttorial"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}