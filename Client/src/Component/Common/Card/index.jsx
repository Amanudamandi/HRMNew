import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoPlaySkipForward } from "react-icons/io5";

function Card({ iconName, cardHeading, count }) {

  return (  
    <div className=" md:w-56 md:p-4">
      <fieldset className="border-2 border-gray-400">
        <legend>
          <img src={iconName} className="h-6 md:h-8 md:w-8 md:pl-1 rounded-full object-cover border-2  border-gray-500" alt={cardHeading}  />
        </legend>
        <div className="pl-4 items-center">
          <div className="flex flex-col items-end pr-2">
            <h6 className="text-gray-700">{cardHeading}</h6>
            <p>{count}</p>
          </div>

          <hr className="h-px bg-gray-400 border-0 dark:bg-gray-400" />
          <div className="flex items-center gap-1">
            <p className="text-gray-700">view detail</p>
            <IoPlaySkipForward size={12} color="rgb(100, 100, 100)" />
          </div>
        </div>

      </fieldset>
    </div>
  );
}

export default Card;
