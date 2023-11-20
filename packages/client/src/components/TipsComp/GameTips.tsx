import { useEffect, useState } from "react";

export const GameTips = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex === 4 ? 0 : prevIndex + 1));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const tip1 = "To move your army, you need to pay 30 food and 30 diomand";
    const tip2 = "If you are going to settle a dock, the number of soldiers in the army must be greater than or equal to 20";
    const tip3 = "In the beginning, your target should be resources";
    const tip4 = "To move your fleet, you need to pay 50 food and 50 diomand";
    const tip5 = "You can deploy as many fleet as number of docks that you have";

    let tipToShow;
    if (index === 0) {
        tipToShow = tip1;
    } else if (index === 1) {
        tipToShow = tip2;
    } else if (index === 2) {
        tipToShow = tip3;
    } else if (index === 3) {
        tipToShow = tip4;
    } else if (index === 4) {
        tipToShow = tip5;
    }

    return (
        <div className="game-tips-box">
            <h4 className='mb-3 text-xl'>Game Tips</h4>
            <p>{tipToShow}</p>
        </div>
    )
};
