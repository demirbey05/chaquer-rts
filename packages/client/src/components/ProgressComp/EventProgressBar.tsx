interface EventProgressBarPropTypes {
    text: string
}

export const EventProgressBar = (props: EventProgressBarPropTypes) => {
    return (
        <div className="event-progress-bar">
            <div className="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar progress-bar-striped progress-bar-animated w-25 fs-6 bg-primary justify-center">{props.text}</div>
            </div>
        </div>
    )
}
