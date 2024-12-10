import getEvent from '../apiFunctions/getEvent';

// Check overlaps among engage events
export const checkEngageOverlaps = async (userData) => {
  const overlappingEvents = [];
  const engageEvents = [];

  // Get full event details for each engage event
  for (const eventId of userData.engage_events) {
    const event = await getEvent(eventId);
    if (event) {
      engageEvents.push(event);
    }
  }

  // Check for overlaps
  for (let i = 0; i < engageEvents.length; i++) {
    for (let j = i + 1; j < engageEvents.length; j++) {
      const event1 = engageEvents[i];
      const event2 = engageEvents[j];
      
      const start1 = new Date(event1.startTime);
      const end1 = new Date(event1.endTime);
      const start2 = new Date(event2.startTime);
      const end2 = new Date(event2.endTime);

      if (end1 > start2 && start1 < end2) {
        if (!overlappingEvents.includes(event1.engage_id)) {
          overlappingEvents.push(event1.engage_id);
        }
        if (!overlappingEvents.includes(event2.engage_id)) {
          overlappingEvents.push(event2.engage_id);
        }
      }
    }
  }

  return overlappingEvents;
};

// Check overlaps between engage events and Google Calendar events
export const checkAllOverlaps = async (userData) => {
  const overlappingEngageEvents = [];
  const overlappingGoogleEvents = [];
  const engageEvents = [];

  // Get full event details for each engage event
  for (const eventId of userData.engage_events) {
    const event = await getEvent(eventId);
    if (event) {
      engageEvents.push(event);
    }
  }

  // Check each engage event against Google events
  for (const engageEvent of engageEvents) {
    const engageStart = new Date(engageEvent.startTime);
    const engageEnd = new Date(engageEvent.endTime);

    for (const googleEvent of userData.google_events) {
      const googleStart = new Date(googleEvent.start);
      const googleEnd = new Date(googleEvent.end);

      if (engageEnd > googleStart && engageStart < googleEnd) {
        if (!overlappingEngageEvents.includes(engageEvent.engage_id)) {
          overlappingEngageEvents.push(engageEvent.engage_id);
        }
        if (!overlappingGoogleEvents.includes(googleEvent.event_id)) {
          overlappingGoogleEvents.push(googleEvent.event_id);
        }
      }
    }
  }

  return {
    overlapping_engage_events: overlappingEngageEvents,
    overlapping_google_events: overlappingGoogleEvents
  };
}; 
