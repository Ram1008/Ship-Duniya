import React, { useState } from "react";

const AccordianButton = ({backgroundColor, buttonHeading, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        className={`w-full p-2 rounded-lg ${backgroundColor} text-primary-foreground flex items-center justify-between cursor-pointer transition-colors`}
        onClick={toggleAccordion}
      >
        <div className="flex gap-2 text-sm items-center justify-center font-semibold">
          <span >{buttonHeading}</span>
          <span className="text-[10px]">{isOpen ? "▲" : "▼"}</span>
        </div>
      </button>
      {isOpen && (
        <div className="absolute text-sm top-full text-secondary-foreground rounded-lg mt-1 shadow-lg z-10">
          {
            options.map((option, index) => (
                <button
                key={index}
                className={`w-full p-2 mb-1 whitespace-nowrap ${backgroundColor} text-primary-foreground rounded-lg transition hover:bg-opacity-90 flex items-center justify-between`}
                onClick={() => option.onClick()}
              >
                {option.label}
              </button>
              
            ))
          }
        </div>
      )}
    </div>
  );
};

export default AccordianButton;
