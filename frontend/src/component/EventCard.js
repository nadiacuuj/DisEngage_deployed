function EventCard({event}){
    console.log(event);
    return(
    <div class="w-fit h-fit shadow-md hover:shadow-2xl border overflow-hidden bg-slate-100 rounded-lg">
        <img class= "object-cover h-48 w-full" src = {event.ImageSrc} alt = "Event image"></img>
        <div class='w-full px-2'>
            <h4 class="text-lg">{event.EventTitle}</h4>
            <p class="text-sm">{event.EventLocation}</p>
            <p class="text-sm">{event.EventTime}</p>
        </div>
    </div>
    )
}

export default EventCard;