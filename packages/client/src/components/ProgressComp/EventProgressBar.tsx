import { Progress, ProgressLabel } from '@chakra-ui/react'
interface EventProgressBarPropTypes {
    text: string
}

export const EventProgressBar = (props: EventProgressBarPropTypes) => {
    return (
        <div className="event-progress-bar">
            <Progress
                isAnimated
                borderRadius={"10px"}
                border={"1px"}
                borderColor={"blakc"}
                hasStripe
                height='25px'
                value={100}
                width={"400px"}>
                <ProgressLabel
                    fontSize={"15px"}
                    textColor={"black"}>
                    {props.text}
                </ProgressLabel>
            </Progress>
        </div>
    )
}
