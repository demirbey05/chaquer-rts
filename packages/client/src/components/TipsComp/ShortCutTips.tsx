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

export const ShortCutTips = () => {
    return (
        <Popover isLazy>
            <PopoverTrigger>
                <button className="circle-button">i</button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Shortcut Tips</PopoverHeader>
                <PopoverBody>
                    <UnorderedList spacing={3}>
                        <ListItem>⚙️ Settings {"->"} Press "S"</ListItem>
                        <ListItem>⚔️ Army Info {"->"} Press "A"</ListItem>
                        <ListItem>🛒 Market {"->"} Press "M"</ListItem>
                    </UnorderedList>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}