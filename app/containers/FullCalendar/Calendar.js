import React from 'react';
import FullCalendar from '@fullcalendar/react';

const Calendar = props => {
  const [state, setState] = React.useState({
    weekendsVisible: true,
    currentEvents: [],
  });
  const {
    plugins,
    headerToolbar,
    initialView,
    handleEventClick,
    eventData,
    allDaySlot,
    dayHeaders,
    customButtons,
    buttonText,
    reference,
    datesSet,
    eventContent,
  } = props;
  const headerToolbarMobile = {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  };

  return (
    <>
      {' '}
      <FullCalendar
        buttonText={buttonText}
        ref={reference}
        plugins={plugins}
        customButtons={customButtons}
        eventContent={eventContent}
        headerToolbar={
          window.innerWidth < 600 ? headerToolbarMobile : headerToolbar
        }
        allDaySlot={allDaySlot}
        selectLongPressDelay={1}
        longPressDelay={1}
        eventLongPressDelay={1}
        initialView={initialView}
        editable={true}
        selectable={true}
        dayMaxEvents={true}
        nowIndicator={true}
        weekends={state.weekendsVisible}
        dayHeaders={dayHeaders}
        events={eventData}
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
        }}
        datesSet={datesSet}
      />{' '}
    </>
  );
};

export default Calendar;
