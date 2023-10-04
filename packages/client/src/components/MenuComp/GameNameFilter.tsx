import { AccordionItem, AccordionIcon, AccordionButton, AccordionPanel, Box } from '@chakra-ui/react'

export const GameNameFilter = ({ setFilter }: { setFilter: (value: string) => void }) => {
    return (
        <AccordionItem>
            <AccordionButton>
                <Box as="span" flex='1' textAlign='left' textColor={"white"}>
                    Filter by Game Name
                </Box>
                <AccordionIcon color={"white"} />
            </AccordionButton>
            <AccordionPanel>
                <input className='form-control bg-transparent text-white dark-input'
                    type="text"
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder='Game Name' />
            </AccordionPanel>
        </AccordionItem>
    )
}