const ListResult = ( {data} ) => {
    return(
        <div>
            {data.map( (item, index) => {
                return (
                    <div className="flex flex-row items-center">
                    <svg viewBox= "0 0 18 18" className="w-4 h-4 m-4"><rect width="18" height="18" x="0" y="0" rx="5" ry="5" fill={item.color}/></svg>
                    <p key ={index}>{item.value}%   {item.evaluation}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default ListResult;