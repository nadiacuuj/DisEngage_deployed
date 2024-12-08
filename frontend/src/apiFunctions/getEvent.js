async function getEvent(event_id) {
    try {
      const userId = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/oneEvent", {
        method: "GET",
        headers: {
          "EventId": event_id,
          "Authorization": `Bearer ${userId}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status code ${response.status}`);
      }
  
      const event = await response.json();
      console.log("FETCH", event); //testing
      return event;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  }

export default getEvent;