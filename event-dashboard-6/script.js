// calendar.js
document.addEventListener("DOMContentLoaded", function () {
  // Calendar functionality
  const calendarContainer = document.querySelector(".bg-\\[\\#C9E6EB\\]");
  if (!calendarContainer) return; // Exit if calendar not found

  const monthYearElement = calendarContainer.querySelector("h2");
  const prevButton = calendarContainer.querySelector("button:first-of-type");
  const nextButton = calendarContainer.querySelector("button:last-of-type");
  const calendarDatesGrid = calendarContainer.querySelector(
    ".calendar-dates-grid"
  );

  // Current date state - start with October 2025 (current month)
  let currentDate = new Date();
  let currentMonth = 9; // October (0-indexed)
  let currentYear = 2025;

  // Sample events data - updated for October 2025
  const events = [
    {
      id: 1,
      title: "Charity Week",
      date: new Date(2025, 9, 6), // October 6, 2025
      time: "10:00 AM - 8:00 PM",
      location: "Dublin, Ireland",
      type: "Charity Event",
      category: "Family Gathering",
    },
    {
      id: 2,
      title: "Community Event",
      date: new Date(2025, 9, 9), // October 9, 2025 (today)
      time: "10:00 AM - 8:00 PM",
      location: "Manchester, UK",
      type: "Charity Event",
      category: "Family Gathering",
    },
    {
      id: 3,
      title: "Workshop",
      date: new Date(2025, 9, 12), // October 12, 2025
      time: "10:00 AM - 8:00 PM",
      location: "Madrid, Spain",
      type: "Charity Event",
      category: "Family Gathering",
    },
  ];

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Add hover effects to navigation buttons
  if (prevButton) {
    prevButton.classList.add("hover:bg-[#A0F2A4]", "transition-colors");
    prevButton.addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
      resetEventsView(); // Reset events when changing month
    });
  }

  if (nextButton) {
    nextButton.classList.add("hover:bg-[#A0F2A4]", "transition-colors");
    nextButton.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
      resetEventsView(); // Reset events when changing month
    });
  }

  // Initialize calendar
  renderCalendar();

  // Render calendar function with no layout shift
  function renderCalendar() {
    // Update month/year display
    monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    // Get all date rows
    const dateRows = calendarDatesGrid.querySelectorAll(".date-group");

    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Get today's date for highlighting
    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === currentYear && today.getMonth() === currentMonth;
    const todayDate = today.getDate();

    // Clear all existing dates and reset styles
    dateRows.forEach((row) => {
      const cells = row.querySelectorAll("div");
      cells.forEach((cell) => {
        cell.innerHTML = "";
        cell.className =
          "w-8 h-8 flex items-center justify-center text-[16px] font-karla font-[300] text-[#09090B] leading-[150%] tracking-[0.08px] cursor-pointer hover:bg-[#A0F2A4] rounded";
        // Remove all event listeners
        cell.replaceWith(cell.cloneNode(true));
      });
    });

    // Re-get cells after cloning (to remove event listeners)
    const allCells = [];
    dateRows.forEach((row) => {
      const cells = row.querySelectorAll("div");
      cells.forEach((cell) => allCells.push(cell));
    });

    // Fill in the calendar days
    let cellIndex = 0;

    // Empty cells before month starts
    for (let i = 0; i < firstDay; i++) {
      if (allCells[cellIndex]) {
        allCells[cellIndex].textContent = "";
      }
      cellIndex++;
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      if (allCells[cellIndex]) {
        const dayElement = allCells[cellIndex];
        dayElement.textContent = day;
        dayElement.className =
          "w-8 h-8 flex items-center justify-center text-[16px] font-karla font-[300] text-[#09090B] leading-[150%] tracking-[0.08px] cursor-pointer hover:bg-[#A0F2A4] rounded";

        // Check if this is today
        if (isCurrentMonth && day === todayDate) {
          dayElement.classList.add(
            "bg-[#11D8F5]",
            "text-white",
            "rounded-full",
            "font-bold"
          );
        }

        // Check if this day has events
        const dateToCheck = new Date(currentYear, currentMonth, day);
        const hasEvents = events.some(
          (event) =>
            event.date.getDate() === day &&
            event.date.getMonth() === currentMonth &&
            event.date.getFullYear() === currentYear
        );

        if (hasEvents) {
          // Make it relative for absolute positioning of indicator
          dayElement.classList.add("relative");

          // Add event indicator
          const eventIndicator = document.createElement("div");
          eventIndicator.className =
            "absolute top-1 right-1 w-2 h-2 bg-[#89EB8E] rounded-full";
          dayElement.appendChild(eventIndicator);

          // Add click event to show events
          dayElement.addEventListener("click", () => {
            showEventsForDate(dateToCheck);
            // Add selected state
            document.querySelectorAll(".calendar-selected").forEach((el) => {
              el.classList.remove("calendar-selected", "bg-[#A0F2A4]");
            });
            if (!dayElement.classList.contains("bg-[#11D8F5]")) {
              dayElement.classList.add(
                "calendar-selected",
                "bg-[#A0F2A4]",
                "rounded-lg"
              );
            }
          });
        }
      }
      cellIndex++;
    }

    // Clear remaining cells
    while (cellIndex < allCells.length) {
      if (allCells[cellIndex]) {
        allCells[cellIndex].textContent = "";
      }
      cellIndex++;
    }
  }

  // Function to show events for a specific date
  function showEventsForDate(date) {
    // Filter events for the selected date
    const filteredEvents = events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );

    // Update events section
    const eventsSection = document.querySelector(
      ".space-y-6.px-3.py-2.mobile-events"
    );
    if (!eventsSection) return;

    eventsSection.innerHTML = "";

    // Add heading with better styling
    const heading = document.createElement("h3");
    heading.className = "text-[20px] font-semibold text-[#000000] mb-4 px-2";
    heading.textContent = `Events for ${date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
    eventsSection.appendChild(heading);

    // If no events, show message with consistent styling
    if (filteredEvents.length === 0) {
      const noEvents = document.createElement("div");
      noEvents.className = "bg-white rounded-[8px] p-6 text-center";
      noEvents.innerHTML = `
        <div class="text-gray-400 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <p class="text-[#5C5C5C] text-[14px]">No events scheduled for this day</p>
        <button class="mt-3 bg-gradient-to-r from-[#89EB8E] to-[#11D8F5] text-[#000000] px-4 py-2 rounded-lg text-[12px] font-medium">
          Add Event
        </button>
      `;
      eventsSection.appendChild(noEvents);
      return;
    }

    // Display events
    filteredEvents.forEach((event) => {
      const eventCard = createEventCard(event);
      eventsSection.appendChild(eventCard);
    });
  }

  // Function to create event card
  function createEventCard(event) {
    const eventCard = document.createElement("div");
    eventCard.className =
      "bg-white rounded-[8px] p-2 flex items-center justify-between mobile-event-card";

    // Format day of week
    const dayOfWeek = event.date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    eventCard.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="bg-event-badge rounded-[8px] px-5 flex flex-col items-center justify-center h-[80px] w-[60px]">
          <div class="text-3xl font-bold text-[#000000]">${event.date.getDate()}</div>
          <div class="text-sm font-medium text-[#000000]">${dayOfWeek}</div>
        </div>

        <div class="">
          <h3 class="text-[25px] font-normal text-[#000000]">${event.title}</h3>

          <div class="flex items-center gap-2 text-[12px] text-[#373737] font-karla">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${event.time}</span>
          </div>

          <div class="flex items-center gap-2 text-[12px] text-[#373737] font-karla">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${event.location}</span>
          </div>
        </div>
      </div>
      <div class="flex gap-3 flex-col justify-center items-center">
        <span class="bg-event-badge text-[#09090B] rounded-md px-[10px] py-[1.5px] text-[12px] font-normal w-[94px]">${
          event.type
        }</span>
        <span class="bg-event-badge text-[#09090B] rounded-md px-[10px] py-[1.5px] text-[12px] font-normal w-[115px]">${
          event.category
        }</span>
      </div>
      <button class="bg-[#7CEAFA] text-[#09090B] rounded-[12px] px-4 py-2 font-medium flex items-center gap-2">
        Manage
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </button>
    `;

    return eventCard;
  }

  // Function to reset events view to show all events
  function resetEventsView() {
    const eventsSection = document.querySelector(
      ".space-y-6.px-3.py-2.mobile-events"
    );
    if (!eventsSection) return;

    eventsSection.innerHTML = "";

    // Add heading with consistent styling
    const heading = document.createElement("h3");
    heading.className = "text-[20px] font-semibold text-[#000000] mb-4 px-2";
    heading.textContent = `${monthNames[currentMonth]} ${currentYear} Events`;
    eventsSection.appendChild(heading);

    // Filter events for current month
    const currentMonthEvents = events.filter(
      (event) =>
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear
    );

    // If no events for current month
    if (currentMonthEvents.length === 0) {
      const noEvents = document.createElement("div");
      noEvents.className = "bg-white rounded-[8px] p-6 text-center";
      noEvents.innerHTML = `
        <div class="text-gray-400 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <p class="text-[#5C5C5C] text-[14px]">No events scheduled for ${monthNames[currentMonth]} ${currentYear}</p>
        <button class="mt-3 bg-gradient-to-r from-[#89EB8E] to-[#11D8F5] text-[#000000] px-4 py-2 rounded-lg text-[12px] font-medium">
          Create Event
        </button>
      `;
      eventsSection.appendChild(noEvents);
      return;
    }

    // Sort events by date
    const sortedEvents = [...currentMonthEvents].sort(
      (a, b) => a.date - b.date
    );

    // Display events
    sortedEvents.forEach((event) => {
      const eventCard = createEventCard(event);
      eventsSection.appendChild(eventCard);
    });
  }

  // Initialize with current month events
  resetEventsView();

  // Mobile sidebar functionality
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebar = document.getElementById("sidebar");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  if (mobileMenuBtn && sidebar && closeSidebarBtn && sidebarOverlay) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.add("active");
      sidebarOverlay.classList.add("active");
    });

    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
    });

    sidebarOverlay.addEventListener("click", () => {
      sidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
    });
  }
});
