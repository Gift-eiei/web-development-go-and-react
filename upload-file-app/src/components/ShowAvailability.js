import React from "react";

const ShowAvailability = (availableCard) => {
  const object = Object.values(availableCard);
  
  const totalWeb = object[0].data.totalWeb;
  const totalTime = object[0].data.totalTime;
  const totalTimeInMin = totalTime/60 > 1 ? totalTime/60 : 0
  const totalTimeInSecond =  totalTime/60 > 1 ? totalTime - 60 : totalTime
  const up = object[0].data.up;
  const down = object[0].data.down;
  const message = object[0].message;

  return (
    <div>
      <div className="px-4 py-2 font-bold text-white bg-red-500 rounded-t" role="alert">
        {message}
      </div>
      <div class="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
        <h1>Total {totalWeb} Websites</h1>
        <h5>Used {totalTimeInMin} minutes and {totalTimeInSecond} seconds</h5>
        <div class = "p-3 max-w-sm rounded-lg border dark:border-gray-700">
          <p>UP</p>
          <p>{up}</p>
        </div>
        <div class = "p-3 max-w-sm rounded-lg border dark:border-gray-700">
          <p>DOWN</p>
          <p>{down}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowAvailability;
