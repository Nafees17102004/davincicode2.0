
import React from "react";

const A = ({
  title = "a",
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) => {

  // Auto-generated event handlers for button

  const handleClick = (e) => {
    if (disabled) return;


    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`primary-btn ${className}`}
      {...props}
    >
      {title}
    </button>
  );
};

export default A;


