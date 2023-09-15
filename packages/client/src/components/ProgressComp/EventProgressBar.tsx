import { Progress, ProgressLabel } from '@chakra-ui/react'

interface EventProgressBarPropTypes {
    text: string
}

export const EventProgressBar = (props: EventProgressBarPropTypes) => {
    return (
        <div className="event-progress-bar">
            <Progress isAnimated hasStripe height='25px' value={100} width={"400px"}>
                <ProgressLabel fontSize={"15px"}>{props.text}</ProgressLabel>
            </Progress>
        </div>
    )
}
