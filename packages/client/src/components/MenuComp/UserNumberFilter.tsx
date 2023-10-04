import { AccordionItem, AccordionIcon, AccordionButton, AccordionPanel, Box, Checkbox } from '@chakra-ui/react'

export const UserNumberFilter = ({ selectedPlayers, setSelectedPlayers }: { selectedPlayers: number[], setSelectedPlayers: (value: number[]) => void }) => {

    const togglePlayerFilter = (numPlayers: number) => {
        if (selectedPlayers.includes(numPlayers)) {
            setSelectedPlayers(selectedPlayers.filter((player) => player !== numPlayers));
        } else {
            setSelectedPlayers([...selectedPlayers, numPlayers]);
        }
    };

    return (
        <AccordionItem>
            <AccordionButton>
                <Box as="span" flex='1' textAlign='left' textColor={"white"}>
                    Filter by # of User
                </Box>
                <AccordionIcon color={"white"} />
            </AccordionButton>
            <AccordionPanel>
                {Array.from({ length: 6 }, (_, i) => i + 3).map((numPlayers) => (
                    <div key={numPlayers}>
                        <Checkbox
                            size='md'
                            colorScheme='green'
                            color={"white"}
                            checked={selectedPlayers.includes(numPlayers)}
                            onChange={() => togglePlayerFilter(numPlayers)}>
                            {numPlayers}
                        </Checkbox>
                    </div>
                ))}
            </AccordionPanel>
        </AccordionItem>
    )
}