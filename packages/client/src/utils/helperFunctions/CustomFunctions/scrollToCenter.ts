import { useEffect } from "react";

export const scrollToCenter = () => {
  useEffect(() => {
    const checkAndScroll = () => {
      const targetDiv = document.getElementById("12,12");
      const scrollOptions: any = {
        behavior: "smooth",
        block: "center",
        inline: "center",
      };

      if (targetDiv) {
        targetDiv.scrollIntoView(scrollOptions);
        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(checkAndScroll, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
};
