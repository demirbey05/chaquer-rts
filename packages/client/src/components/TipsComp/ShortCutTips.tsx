import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    ListItem,
    UnorderedList
} from '@chakra-ui/react'
import { FaCircleInfo } from 'react-icons/fa6'
import { FiSettings } from 'react-icons/fi'
import { GiShipBow } from 'react-icons/gi'
import { SlBasket } from 'react-icons/sl'
import { FaUsers } from 'react-icons/fa'
import { BsFillChatDotsFill } from 'react-icons/bs'
import { AiOutlineStock } from 'react-icons/ai'

export const ShortCutTips = () => {
    return (
        <Popover isLazy>
            <PopoverTrigger>
                <button className="tips-button">
                    <FaCircleInfo />
                </button>
            </PopoverTrigger>
            <PopoverContent backgroundColor={"blackAlpha.700"} color={"white"}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Shortcut Tips</PopoverHeader>
                <PopoverBody>
                    <UnorderedList spacing={2}>
                        <ListItem>
                            <div className='d-flex align-items-center'>
                                <FiSettings className='me-2' />
                                <p>
                                    Settings {"->"} Press "S"
                                </p>
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className='d-flex align-items-center'>
                                ⚔️
                                <p className='ms-2'>
                                    Army Info {"->"} Press "A"
                                </p>
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className='d-flex align-items-center'>
                                <GiShipBow className='me-2' />
                                <p>
                                    Army Info {"->"} Press "A"
                                </p>
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className='d-flex align-items-center'>
                                <SlBasket className='me-2' />
                                <p>
                                    Market {"->"} Press "M"
                                </p>
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className='d-flex align-items-center'>
                                <FaUsers className='me-2' />
                                <p>
                                    Players {"->"} Press "U"
                                </p>
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className='d-flex align-items-center'>
                                <BsFillChatDotsFill className='me-2' />
                                <p>
                                    Chat {"->"} Press "C"
                                </p>
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className='d-flex align-items-center'>
                                💥
                                <p className='ms-2'>
                                    War Results {"->"} Press "W"
                                </p>
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className='d-flex align-items-center'>
                                <AiOutlineStock className='me-2' />
                                <p>
                                    Prices {"->"} Press "P"
                                </p>
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className='d-flex align-items-center'>
                                🔎
                                <p className='ms-2'>
                                    Zoom In {"->"} Mouse Wheel
                                </p>
                            </div>
                        </ListItem>
                        <ListItem>
                            <div className='d-flex align-items-center'>
                                🔎
                                <p className='ms-2'>
                                    Zoom Out {"->"} Mouse Wheel
                                </p>
                            </div>
                        </ListItem>
                    </UnorderedList>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}