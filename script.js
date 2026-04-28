// Variables to track calendar state
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let events = [];

// Month names for display
let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

// Function to create and display the calendar
function displayCalendar() {
    let monthYearElement = document.getElementById('monthYear');
    let calendarDaysElement = document.getElementById('calendarDays');
    
    // Update month/year display
    monthYearElement.innerText = monthNames[currentMonth] + " " + currentYear;
    
    // Clear previous calendar days
    calendarDaysElement.innerHTML = '';
    
    // Get first day of month and number of days
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        let emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarDaysElement.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        let dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.innerText = day;
        
        // Check if this day has events
        let dateString = currentYear + "-" + (currentMonth + 1).toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');
        let dayEvents = getEventsForDate(dateString);
        
        if (dayEvents.length > 0) {
            dayElement.className += ' has-events';
            // Add event dot
            let eventDot = document.createElement('div');
            eventDot.className = 'event-dot';
            dayElement.appendChild(eventDot);
        }
        
        // Add click listener to each day
        dayElement.addEventListener('click', function() {
            selectDay(day, dayElement);
        });
        
        calendarDaysElement.appendChild(dayElement);
    }
}

// Function to select a day and show its events
function selectDay(day, dayElement) {
    // Remove previous selection
    let previousSelected = document.querySelector('.calendar-day.selected');
    if (previousSelected) {
        previousSelected.className = previousSelected.className.replace(' selected', '');
    }
    
    // Add selection to clicked day
    dayElement.className += ' selected';
    
    // Store selected date
    selectedDate = currentYear + "-" + (currentMonth + 1).toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');
    
    // Show events for selected day
    showEventsForSelectedDay(selectedDate);
}

// Function to show events for the selected day
function showEventsForSelectedDay(dateString) {
    let selectedDayTitle = document.getElementById('selectedDayTitle');
    let dayEventsList = document.getElementById('dayEventsList');
    
    // Format date for display
    let date = new Date(dateString);
    let formattedDate = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    
    selectedDayTitle.innerText = "Events for " + formattedDate;
    
    // Get events for this date
    let dayEvents = getEventsForDate(dateString);
    
    // Clear previous events
    dayEventsList.innerHTML = '';
    
    if (dayEvents.length === 0) {
        dayEventsList.innerHTML = '<p style="color: #666;">No events scheduled for this day.</p>';
    } else {
        for (let i = 0; i < dayEvents.length; i++) {
            let event = dayEvents[i];
            let eventElement = document.createElement('div');
            eventElement.className = 'day-event';
            
            eventElement.innerHTML = 
                '<div class="event-title">' + event.title + '</div>' +
                '<div class="event-details">' +
                    '<strong>Time:</strong> ' + event.time + '<br>' +
                    '<strong>Location:</strong> ' + event.location + '<br>' +
                    '<strong>Type:</strong> ' + event.type +
                '</div>';
            
            dayEventsList.appendChild(eventElement);
        }
    }
}

// Function to get events for a specific date
function getEventsForDate(dateString) {
    let dayEvents = [];
    for (let i = 0; i < events.length; i++) {
        if (events[i].date === dateString) {
            dayEvents.push(events[i]);
        }
    }
    return dayEvents;
}

// Function to show event form
function showEventForm() {
    let eventForm = document.getElementById('eventForm');
    eventForm.style.display = 'block';
    
    // Set date to selected date if one is selected
    if (selectedDate) {
        document.getElementById('eventDate').value = selectedDate;
    }
}

// Function to hide event form
function hideEventForm() {
    let eventForm = document.getElementById('eventForm');
    eventForm.style.display = 'none';
    
    // Clear form
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventLocation').value = '';
    document.getElementById('eventType').value = 'tournament';
}

// Function to save new event
function saveEvent() {
    let title = document.getElementById('eventTitle').value;
    let date = document.getElementById('eventDate').value;
    let time = document.getElementById('eventTime').value;
    let location = document.getElementById('eventLocation').value;
    let type = document.getElementById('eventType').value;
    
    // Check if all fields are filled
    if (title === '' || date === '' || time === '' || location === '') {
        alert('Please fill in all fields!');
        return;
    }
    
    // Create new event
    let newEvent = {
        title: title,
        date: date,
        time: time,
        location: location,
        type: type
    };
    
    // Add to events array
    events.push(newEvent);
    
    // Save to localStorage
    localStorage.setItem('softballEvents', JSON.stringify(events));
    
    // Hide form
    hideEventForm();
    
    // Refresh calendar to show new event
    displayCalendar();
    
    // If the event is for the selected date, refresh the events list
    if (selectedDate === date) {
        showEventsForSelectedDay(selectedDate);
    }
    
    alert('Event saved successfully!');
}

// Function to go to previous month
function previousMonth() {
    currentMonth = currentMonth - 1;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear = currentYear - 1;
    }
    displayCalendar();
}

// Function to go to next month
function nextMonth() {
    currentMonth = currentMonth + 1;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear = currentYear + 1;
    }
    displayCalendar();
}

// Function to go to today
function goToToday() {
    let today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    displayCalendar();
}

// Function to load events from localStorage
function loadEvents() {
    let savedEvents = localStorage.getItem('softballEvents');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
    }
}

// Set up all event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load saved events
    loadEvents();
    
    // Display initial calendar
    displayCalendar();
    
    // Button event listeners
    document.getElementById('addEventBtn').addEventListener('click', showEventForm);
    document.getElementById('saveEventBtn').addEventListener('click', saveEvent);
    document.getElementById('cancelEventBtn').addEventListener('click', hideEventForm);
    document.getElementById('prevMonthBtn').addEventListener('click', previousMonth);
    document.getElementById('nextMonthBtn').addEventListener('click', nextMonth);
    document.getElementById('todayBtn').addEventListener('click', goToToday);
    
    console.log("Calendar loaded successfully!");
});
