import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Accordion = ({ sections, openIndex, setOpenIndex }) => {
  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full h-screen">
      {sections.map(({ label, content }, index) => (
        <div
          key={index}
          className="border border-zinc-700 rounded-md mb-2 overflow-hidden"
        >
          {/* Heading with background */}
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-300"
          >
            <span className="text-sm md:text-base font-medium">{label}</span>
            {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {/* Accordion Content */}
          {openIndex === index && (
            <div className="px-4 pb-4 pt-2 bg-white">
              {content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;

