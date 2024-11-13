function EventCard({event}){
    console.log(event);
    return(
    <div class="w-fit h-fit shadow-md hover:shadow-2xl border overflow-hidden bg-slate-100 rounded-lg">
        <img class= "object-cover h-40 w-full" src = {event.ImageSrc} alt = "Event image"></img>
        <div class='w-full'>
            <p class="text-lg leading-tight p-2 m-2 max-w-[331px] break-words">{event.EventTitle}</p>
            <p class="text-sm px-2 mx-2">{event.EventLocation}</p>
            <p class="text-sm px-2 mx-2 pb-2 mb-2">{event.EventTime}</p>
        </div>
    </div>
    )
}

export default EventCard;