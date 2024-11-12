const PieChart = ( {data} ) => {

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercent = 0;

    return (
        <svg viewBox="0 0 36 36" className="w-64 h-64"> 
            {data.map( (item,index) => {
                const {color, value} = item;
                const percentage = value / total;
                const startOffset = cumulativePercent;
                cumulativePercent += percentage;

                const dashArray = `${percentage * 100} ${100 - percentage * 100}`;
                const rotate = startOffset * 360;

                return(
                    <circle
                    key={index}
                    r="15"
                    cx="18"
                    cy="18"
                    fill="transparent"
                    stroke={color}
                    strokeWidth="3.2"
                    strokeDasharray={dashArray}
                    transform={`rotate(${rotate} 18 18)`}>
                    </circle>
                );
            })}
        </svg>
    );
};

export default PieChart;