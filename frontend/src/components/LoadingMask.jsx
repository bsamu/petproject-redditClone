import React from "react";
import LoadingSpin from "react-loading-spin";

import "../styles/loading.css";

const LoadingMask = ({ setTheme }) => {
  return (
    <div className="loadingAnimation">
      <LoadingSpin
        duration="2s"
        width="15px"
        timingFunction="ease-in-out"
        direction="alternate"
        size="200px"
        primaryColor={setTheme.buttonHover}
        secondaryColor={setTheme.navbar}
        numberOfRotationsInAnimation={2}
      />
    </div>
  );
};

export default LoadingMask;
