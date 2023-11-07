import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    ListItem,
    UnorderedList,
} from '@chakra-ui/react'
import { FcInfo } from 'react-icons/fc'

export const ShortCutTips = () => {
    return (
        <Popover isLazy>
            <PopoverTrigger>
                <button className="tips-button"><FcInfo /></button>
            </PopoverTrigger>
            <PopoverContent backgroundColor={"blackAlpha.700"} color={"white"}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Shortcut Tips</PopoverHeader>
                <PopoverBody>
                    <UnorderedList spacing={3}>
                        <ListItem>⚙️ Settings {"->"} Press "S"</ListItem>
                        <ListItem>⚔️ Army Info {"->"} Press "A"</ListItem>
                        <ListItem>🚢 Fleet Info {"->"} Press "F"</ListItem>
                        <ListItem>🛒 Market {"->"} Press "M"</ListItem>
                        <ListItem>🎮 Players {"->"} Press "U"</ListItem>
                        <ListItem>💬 Chat {"->"} Press "C"</ListItem>
                        <ListItem>💥 War Results {"->"} Press "W"</ListItem>
                        <ListItem>＄ Prices {"->"} Press "P"</ListItem>
                        <ListItem>🔎 Zoom In (+) {"->"} Press "I"</ListItem>
                        <ListItem>🔎 Zoom Out (-) {"->"} Press "O"</ListItem>
                    </UnorderedList>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}