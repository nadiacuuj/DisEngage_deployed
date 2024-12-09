import getEvent from "./getEvent";
import getUserInfo from "./getUserInfo";

async function getEngageArray() {
    const response = await getUserInfo();
    const eventData = response.engage_events || [];

    console.log("THIS IS ARRAY  ", eventData);
    const event_array = [];

    if (eventData && eventData.length > 1) {
        for(let i = 1; i < eventData.length; i++){
            let event_t = await getEvent(eventData[i]);
            event_array.push(event_t);
        }
    }
    
    console.log("ALL EVENTS: ", event_array);
    return event_array;
}

export default getEngageArray;