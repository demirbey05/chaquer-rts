import { PiWarningOctagonFill } from 'react-icons/pi'

export const CustomToastMessage = ({ title, message }: {
    title: string | undefined,
    message: string | undefined
}) => {
    return (
        <div className="my-warning-alert">
            <div className="my-warning-title">
                <PiWarningOctagonFill className='me-3' />
                {title}
            </div>
            <div className="my-warning-message">
                {message}
            </div>
        </div>
    )
};
