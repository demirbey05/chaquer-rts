interface CustomToastMessagePropTypes {
    title: string | undefined,
    message: string | undefined
}

export const CustomToastMessage = (props: CustomToastMessagePropTypes) => {
    return <div className="toast bg-danger bottom-2 end-2 absolute text-white" style={{ display: "block", zIndex: "10" }} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header bg-danger text-white font-extrabold">
            <strong className="me-auto">{props.title}</strong>
            <button type="button" className="text-white" data-bs-dismiss="toast" aria-label="Close">╳</button>
        </div>
        <div className="toast-body">
            {props.message}
        </div>
    </div>
};
