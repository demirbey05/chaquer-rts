interface CustomToastMessagePropTypes {
    title: string | undefined,
    message: string | undefined
}

export const CustomToastMessage = (props: CustomToastMessagePropTypes) => {
    return (
        <div className="my-warning-alert">
            <div className="my-warning-title">{props.title}</div>
            <div className="my-warning-message">{props.message}</div>
        </div>
    )
};
