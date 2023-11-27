import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box
} from '@chakra-ui/react'
import { FaCheck } from "react-icons/fa";
import { IoGameControllerOutline, IoWarningOutline } from 'react-icons/io5'
import { useState, useEffect } from 'react';

export const GameTutorial = () => {
    const [helloTask, setHelloTask] = useState(localStorage.getItem("helloTask"));
    const [armySettlementTask, setArmySettlementTask] = useState(localStorage.getItem("armySettlementTask"));
    const [armyMovementTask, setArmyMovementTask] = useState(localStorage.getItem("armyMovementTask"));
    const [updateArmyTask, setUpdateArmyTask] = useState(localStorage.getItem("updateArmyTask"));
    const [mergeTwoArmiesTask, setMergeTwoArmiesTask] = useState(localStorage.getItem("mergeTwoArmiesTask"));
    const [attackCaptureTask, setAttackCaptureTask] = useState(localStorage.getItem("attackCaptureTask"));
    const [dockSettlementTask, setDockSettlementTask] = useState(localStorage.getItem("dockSettlementTask"));
    const [fleetSettlementTask, setFleetSettlementTask] = useState(localStorage.getItem("fleetSettlementTask"));
    const [fleetMovementTask, setFleetMovementTask] = useState(localStorage.getItem("fleetMovementTask"));

    useEffect(() => {
        const handleStorageChange = () => {
            setHelloTask(localStorage.getItem("helloTask"));
            setArmySettlementTask(localStorage.getItem("armySettlementTask"));
            setArmyMovementTask(localStorage.getItem("armyMovementTask"));
            setUpdateArmyTask(localStorage.getItem("updateArmyTask"));
            setMergeTwoArmiesTask(localStorage.getItem("mergeTwoArmiesTask"));
            setAttackCaptureTask(localStorage.getItem("attackCaptureTask"));
            setDockSettlementTask(localStorage.getItem("dockSettlementTask"));
            setFleetSettlementTask(localStorage.getItem("fleetSettlementTask"));
            setFleetMovementTask(localStorage.getItem("fleetMovementTask"));
        };

        window.addEventListener('localDataStorage', handleStorageChange, false);

        return () => {
            window.removeEventListener('localDataStorage', handleStorageChange, false);
        };
    }, []);

    return (
        <>
            <Popover isLazy defaultIsOpen={true}>
                <PopoverTrigger>
                    <button className="game-tutorial-button">
                        <IoGameControllerOutline />
                    </button>
                </PopoverTrigger>
                <PopoverContent backgroundColor={"blackAlpha.700"} color={"white"}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>
                        Basic Game Play Onboarding
                    </PopoverHeader>
                    <PopoverBody>
                        <Accordion allowToggle defaultIndex={[0]}>
                            <AccordionItem>
                                <h2 className={helloTask === null ? "text-warning" : "text-success"}>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Say Hello to Other Players
                                            {helloTask === null ? <IoWarningOutline /> : <FaCheck />}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <p>1. Press the "C" key and close this onboarding panel.</p>
                                    <p>2. You will see the chat panel.</p>
                                    <p>3. Type "hello" to input field and send.</p>
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem >
                                <h2 className={armySettlementTask === null ? "text-warning" : "text-success"}>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Army Settlement
                                            {armySettlementTask === null ? <IoWarningOutline /> : <FaCheck />}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <p>1. Click on your castles and see the orange tiles.</p>
                                    <p>2. Then click one of orange tile that you want to settle your army.</p>
                                    <p>3. Then determine your army size by entering soldier number on Army Settle Modal</p>
                                    <p>4. Then click Settle Army button.</p>
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2 className={armyMovementTask === null ? "text-warning" : "text-success"}>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Army Movement
                                            {armyMovementTask === null ? <IoWarningOutline /> : <FaCheck />}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <p>1. Do not forget, each move costs 30 food + 30 diomand.</p>
                                    <p>2. Click on your armies and see the blue tiles.</p>
                                    <p>3. Then click one of blue tile that you want to move.</p>
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2 className={updateArmyTask === null ? "text-warning" : "text-success"}>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Update Army Size
                                            {updateArmyTask === null ? <IoWarningOutline /> : <FaCheck />}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <p>1. To update army size, you need to bring the army inside any of your castles' settlement ranges. </p>
                                    <p>2. Then you click the castle</p>
                                    <p>3. Then click the army, and you will see the Army Update panel.</p>
                                    <p>4. You write the new configuration here then by clicking “Update Army”, you can update your army size You cannot decrement any unit.</p>
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2 className={mergeTwoArmiesTask === null ? "text-warning" : "text-success"}>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Merge Two Armies
                                            {mergeTwoArmiesTask === null ? <IoWarningOutline /> : <FaCheck />}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <p>1. To merge two armies, this two armies must be side by side.</p>
                                    <p>2.  Click one of the armies then click another army, you will see the pop-up at the bottom </p>
                                    <p>3. Click “Merge the Armies” at the pop-up.</p>
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2 className={attackCaptureTask === null ? "text-warning" : "text-success"}>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Attack and Capture
                                            {attackCaptureTask === null ? <IoWarningOutline /> : <FaCheck />}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <p>1. You can attack to an army or fleet and capture a castle & resource & dock.</p>
                                    <p>2. Click on your armies and see the blue tiles.</p>
                                    <p>3. The object that you want to attack or capture must be in the blue tiles.</p>
                                    <p>4. Then click one of blue tile that you want to attack or capture.</p>
                                    <p>5. Then make your move according to the battle informations.</p>
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2 className={dockSettlementTask === null ? "text-warning" : "text-success"}>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Dock Settlement
                                            {dockSettlementTask === null ? <IoWarningOutline /> : <FaCheck />}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <p>1. You can only build dock on "seasides".</p>
                                    <p>2. The size of army that is going to settle a dock must be bigger than 19.</p>
                                    <p>3. To settle a dock, a seaside tile must be in the blue tiles of a your army.</p>
                                    <p>4. Click on this army and then click the seaside tile that you want to settle a dock.</p>
                                    <p>5. Then Dock Settle modal shows up and you can see the dock cost.</p>
                                    <p>6. Then you can make a decision according to the cost.</p>
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2 className={fleetSettlementTask === null ? "text-warning" : "text-success"}>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Fleet Settlement
                                            {fleetSettlementTask === null ? <IoWarningOutline /> : <FaCheck />}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <p>1. Click the dock you want to settle a fleet from.</p>
                                    <p>2. You can only settle the orange tiles. After selecting the tile the army, you will see the Fleet Settlement screen.</p>
                                    <p>3. In this screen, you are required to enter the army configuration, if you leave any input field blank, it will be accepted as 0.</p>
                                    <p>4. After pressing “Settle Fleet”, the fleet will be settled.</p>
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2 className={fleetMovementTask === null ? "text-warning" : "text-success"}>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Fleet Movement
                                            {fleetMovementTask === null ? <IoWarningOutline /> : <FaCheck />}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <p>1. Click the fleet you want to move. After clicking, you will see green highlighted tiles .</p>
                                    <p>2. You can only move green highlighted tiles. If any object is in any green tile, you cannot move that tile.</p>
                                    <p>3. Click the green highlighted tile you want to move.</p>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </PopoverBody>
                </PopoverContent>
            </Popover >
        </>
    )
}