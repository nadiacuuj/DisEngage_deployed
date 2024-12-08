import getEvent from "./getEvent";
import getUserInfo from "./getUserInfo";

async function getEngageArray() {
    const response = await getUserInfo();
    const eventData = response.engage_events;

    console.log("THIS IS ARRAY  ", eventData);
    // skip first due to empty array default
    const event_array = []

    for(let i = 1; i<eventData.length; i++){
        let event_t = getEvent(eventData[i]);
        event_array.push(event_t);
    }
    console.log("ALL EVENTS: ",event_array);
    return event_array;
}

export default getEngageArray;