import React from 'react';

const RatingDistribution = ({ data }) => {
  // Calculate the maximum value for scaling the bars
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="p-4 m-8 bg-white shadow-md rounded-lg inline-block w-[400px] h-fit ">
        <h2 className="text-lg font-semibold mb-4">Rating Distribution</h2>
        
        {data.map((item, index) => (
            <div key={index} className="flex items-center mb-2  w-full">
                <div className="min-w-max w-1/3 text-right pr-2 font-medium">
                    {item.label}
                </div>

                <div className=" flex items-center w-3/4">
                    <div
                        className="bg-blue-500 h-4"
                        style={{ width: `${(item.value / maxValue) * 100}%` }}
                    ></div>
                    <div className="ml-2 text-sm font-semibold">
                        {item.value}
                    </div>
                </div>
            </div>
        ))}
  </div>
  
  );
};

export default RatingDistribution;




