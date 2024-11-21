import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid'; // For day grid view
import interactionPlugin from '@fullcalendar/interaction'; // For interactivity
import Navigationbar from '../component/NavigationBar';

const DemoApp = () => {
  return (
    <div>
    <Navigationbar></Navigationbar>
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,dayGridMonth,timeGridDay',
      }}
      slotMinTime={"09:00:00"}
      slotMaxTime={"21:00:00"}
      events={[
        { title: 'Conference', start: '2024-11-21', allDay: true },
        { title: 'Meeting', start: '2024-11-21T10:30:00', end: '2024-11-21T12:30:00' },
        { title: 'Lunch', start: '2024-11-21T12:00:00' },
      ]}
    />
    </div>
  );
};

export default DemoApp;
