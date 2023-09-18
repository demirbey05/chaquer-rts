import { CreditCount } from "./CreditCount";

export const CreditProgressBar = () => {
    return (
        <div className="credit-progress-bar">
            <div className="row">
                <div className="col-4 credit-progress-bar-col">
                    <CreditCount />
                </div>
            </div>
        </div>
    )
}