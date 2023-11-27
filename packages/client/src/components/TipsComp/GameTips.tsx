import { useEffect, useState } from "react";

export const GameTips = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex === 7 ? 0 : prevIndex + 1));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const tip1 = "To move your army, you need to pay 30 food and 30 diomand";
    const tip2 = "If you are going to settle a dock, the number of soldiers in the army must be greater than or equal to 20";
    const tip3 = "In the beginning, your target should be resources";
    const tip4 = "To move your fleet, you need to pay 50 food and 50 diomand";
    const tip5 = "You can deploy as many fleet as number of docks that you have";
    const tip6 = "You can load your fleets with armies if you need to across the sea"
    const tip7 = "If your armies next to each other, you can merge them"
    const tip8 = "You can update your armies by moving them to your castle's orange tiles"

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
    } else if (index === 5) {
        tipToShow = tip6;
    } else if (index === 6) {
        tipToShow = tip7;
    } else if (index === 7) {
        tipToShow = tip8;
    }

    return (
        <div className="game-tips-box">
            <h4 className='mb-3 text-xl'>Game Tips</h4>
            <p>{tipToShow}</p>
        </div>
    )
};
