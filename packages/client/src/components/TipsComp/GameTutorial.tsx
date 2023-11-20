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
import { IoGameControllerOutline } from 'react-icons/io5'

export const GameTutorial = () => {
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
                            <AccordionItem >
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Army Settlement
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} textColor={"aqua"}>
                                    <p>1. Click on your castles and see the orange tiles.</p>
                                    <p>2. Then click one of orange tile that you want to settle your army.</p>
                                    <p>3. Then determine your army size by entering soldier number on Army Settle Modal</p>
                                    <p>4. Then click Settle Army button.</p>
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Army Movement
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} textColor={"aqua"}>
                                    <p>1. Do not forget, each move costs 30 food + 30 diomand.</p>
                                    <p>2. Click on your armies and see the blue tiles.</p>
                                    <p>3. Then click one of blue tile that you want to move.</p>
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Attack and Capture
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} textColor={"aqua"}>
                                    <p>1. You can attack to an army or fleet and capture a castle & resource & dock.</p>
                                    <p>2. Click on your armies and see the blue tiles.</p>
                                    <p>3. The object that you want to attack or capture must be in the blue tiles.</p>
                                    <p>4. Then click one of blue tile that you want to attack or capture.</p>
                                    <p>5. Then make your move according to the battle informations.</p>
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Dock Settlement
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} textColor={"aqua"}>
                                    <p>1. You can only build dock on "seasides".</p>
                                    <p>2. The size of army that is going to settle a dock must be bigger than 19.</p>
                                    <p>3. To settle a dock, a seaside tile must be in the blue tiles of a your army.</p>
                                    <p>4. Click on this army and then click the seaside tile that you want to settle a dock.</p>
                                    <p>5. Then Dock Settle modal shows up and you can see the dock cost.</p>
                                    <p>6. Then you can make a decision according to the cost.</p>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}