/**
 * @file calendars.js
 * @fileoverview Manages meetings, displays the meeting and sprint details in calendar,
 *               retrieves and updates meeting details, and handles meeting cancellations.
 * @module FullCalendar
 * @requires FullCalendar
 * @since 2024-06-25
 * @author Hari Sankar, Gokul ,Rama Selvan, Ruban Edward.
 */

/**
 * Initializes the FullCalendar instance when the DOM content is fully loaded.
 * @event DOMContentLoaded
 * @listens document#DOMContentLoaded
 * @description This function is called when the DOM is fully loaded. It sets up the calendar
 *              element, initializes the default event type, and creates a new FullCalendar instance
 *              with specific configurations.
 */

document.addEventListener("DOMContentLoaded", function () {
  /**
   * The HTML element where the calendar will be rendered.
   * @type {HTMLElement}
   */
  var calendarEl = document.getElementById("calendar");

  /**
   * The current event type to be displayed in the calendar.
   * @type {string}
   */
  var currentEventType = "Meeting";

  /**
   * The FullCalendar instance initialized with configurations.
   * @type {FullCalendar.Calendar}
   */
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      start: "prev today next",
      center: "title",
      end: "HelpButton GroupButton MeetingDropdown MeetTypeDropdown ProductDropdown StatusDropdown",
    },
    dayMaxEventRows: true,
    fixedWeekCount: true,

    //Custom buttons for the filters in the calendar.
    customButtons: {
      //Dropdown for filtering different types of meetings. Only if meetings is selected in Events
      MeetTypeDropdown: {
        /**
         * Click handler for the MeetType dropdown button.
         * @function
         */
        click: function () {
          /**
           * Populates the MeetType dropdown with items.
           * @function
           */
          function populateMeetTypeDropdown() {
            var meetTypeDropdown = document.getElementById("meetTypeDropdown");
            meetTypeDropdown.innerHTML = ""; // Clear previous items

            // Create and append 'All' dropdown item
            var allDropdownItem = createDropdownItem("All");
            meetTypeDropdown.appendChild(allDropdownItem);

            // Populate dropdown with meeting types
            meetType.forEach(function (meetType) {
              const MeetType = meetType.meeting_type_name;
              const dropdownItem = createDropdownItem(MeetType);
              //  dropdownItem.id = `meetTypeItem-${index}`; // Assigning a unique ID to each item
              //  initializeTooltip(`#meetTypeItem-${index}`, `Click "${MeetType}" to see all "${MeetType}" meetings`);

              meetTypeDropdown.appendChild(dropdownItem);
            });

            // Event listeners for the newly created dropdown items
            document
              .querySelectorAll(".dropdown-item.meetType")
              .forEach((item) => {
                item.addEventListener("click", function (event) {
                  event.preventDefault();
                  filterEventsByEventType(this.textContent);
                  document.getElementById("dropdownMenuButton4").innerHTML =
                    "<b>MeetType</b>: " + this.innerText;
                });
              });
          }

          /**
           * Creates a dropdown item element.
           *
           * @param {string} text - The text content of the dropdown item.
           * @returns {HTMLAnchorElement} The created dropdown item element.
           */
          function createDropdownItem(text) {
            var dropdownItem = document.createElement("a");
            dropdownItem.className = "dropdown-item meetType";
            dropdownItem.href = "#";
            var icon = document.createElement("i");
            icon.className = getIconClass(text); // Function to get icon class based on meeting type
            dropdownItem.appendChild(icon);
            var textNode = document.createTextNode(" " + text); // Add a space between icon and text
            dropdownItem.appendChild(textNode);
            return dropdownItem;
          }

          /**
           * Filters calendar events by event type.
           *
           * @param {string} MeetType - The type of event to filter by. If 'All', all events are shown.
           */
          function filterEventsByEventType(MeetType) {
            calendar.getEvents().forEach((event) => {
              let eventType = event.title.trim().split(" - ")[0];
              let Meet = MeetType.trim();
              var showEvent = eventType == Meet || Meet == "All";
              event.setProp("display", showEvent ? "auto" : "none");
            });
          }

          // Populate the dropdown menu initially
          populateMeetTypeDropdown();
        },
      },

      //Dropdown for filtering different types of Products. Only if sprint is selected in Events
      ProductDropdown: {
        /**
         * Click handler for the Product dropdown button.
         *
         * @function
         */
        click: function () {
          /**
           * Populates the Product dropdown with items.
           * @function
           */
          function populateProductDropdown() {
            var productDropdown = document.getElementById("productDropdown");
            productDropdown.innerHTML = ""; // Clear previous items

            // Create and append 'All' dropdown item
            var allDropdownItem = createProductDropdownItem("All");
            productDropdown.appendChild(allDropdownItem);

            // Populate dropdown with different products
            productList.forEach(function (product) {
              var ProductName = capitalizeFirstLetter(product["product_name"]);
              var dropdownItem = createProductDropdownItem(ProductName);
              productDropdown.appendChild(dropdownItem);
            });

            // Ensure dropdown is scrollable if items exceed a certain number
            if (productList.length > 5) {
              productDropdown.style.overflowY = "auto";
              productDropdown.style.maxHeight = "200px"; // Adjust as needed
            } else {
              productDropdown.style.overflowY = "hidden"; // Hide scrollbar if not needed
            }

            // Event listeners for the custom dropdown options for product
            document
              .querySelectorAll(".dropdown-item.product")
              .forEach((item) => {
                item.addEventListener("click", function (event) {
                  event.preventDefault();
                  filterEventsByEventType(this.textContent);
                  document.getElementById("dropdownMenuButton1").innerHTML =
                    "<b>Product</b>: " + this.textContent;
                });
              });
          }

          /**
           * Creates a dropdown item element for products.
           *
           * @param {string} text - The text content of the dropdown item.
           * @returns {HTMLAnchorElement} The created dropdown item element.
           */
          function createProductDropdownItem(text) {
            var dropdownItem = document.createElement("a");
            dropdownItem.className = "dropdown-item product";
            dropdownItem.href = "#";
            dropdownItem.textContent = text;
            return dropdownItem;
          }

          /**
           * Filters calendar events by product type.
           *
           * @param {string} product - The type of product to filter by. If 'All', all events are shown.
           */
          function filterEventsByEventType(product) {
            calendar.getEvents().forEach((event) => {
              var ProductName = getNameAfterHyphen(event._def.title);
              var showEvent = ProductName === product || product === "All";
              event.setProp("display", showEvent ? "auto" : "none");
            });
          }

          /**
           * Extracts the part of a string after the first hyphen.
           *
           * @param {string} str - The input string containing a hyphen.
           * @returns {string} The part of the string after the hyphen, or an empty string if no hyphen is found.
           */
          function getNameAfterHyphen(str) {
            const parts = str.split("->");

            // Return the part after the hyphen, or an empty string if there's no hyphen
            return parts.length > 1 ? parts[1].trim() : "";
          }

          // Add click event listener to the button
          populateProductDropdown();
        },
      },

      //Dropdown for filtering Meetings and Sprints with different status.
      StatusDropdown: {
        /**
         * Click handler for the Status dropdown button.
         * @function
         */
        click: function () {
          /**
           * Populates the Status dropdown with items.
           * @function
           */
          function populateStatusDropdown() {
            var statusDropdown = document.getElementById("statusDropdown");
            statusDropdown.innerHTML = ""; // Clear previous items

            // Create and append 'All' dropdown item
            var statuses =
              currentEventType === "Sprint"
                ? [
                    "All",
                    "Sprint Completed",
                    "Sprint Running",
                    "Sprint Planned",
                    "On Hold",
                  ]
                : ["All", "Completed", "Ongoing", "Upcoming"];

            // Populate dropdown with different Status
            statuses.forEach(function (status) {
              var dropdownItem = document.createElement("a");
              dropdownItem.className = "dropdown-item status";
              dropdownItem.href = "#";
              var icon = document.createElement("i");
              icon.className = getIconClass(status); // Function to get icon class based on status
              dropdownItem.appendChild(icon);
              // Create text node for status
              var text = document.createTextNode(" " + status); // Add a space between icon and text
              dropdownItem.appendChild(text);
              statusDropdown.appendChild(dropdownItem);

              // Add event listener to each dropdown item
              dropdownItem.addEventListener("click", function (event) {
                event.preventDefault();
                filterEventsByStatus(status);
                document.getElementById("dropdownMenuButton3").innerHTML =
                  "<b>Status</b>: " + status;
              });
            });

            /**
             * Filters calendar events based on status.
             *
             * @param {string} status - The status to filter events by ('All', 'Completed', 'Ongoing', 'Upcoming').
             */
            function filterEventsByStatus(status) {
              calendar.getEvents().forEach((event) => {
                var showEvent = false;

                // Check if current event type is 'Sprint' to filter by status name
                if (currentEventType === "Sprint") {
                  var statusName = capitalizeFirstLetter(
                    event.extendedProps.statusName
                  );
                  showEvent = status === "All" || statusName === status;
                } else {
                  // For other event types, filter events based on their start and end dates
                  const currentDate = new Date();
                  var eventStart = new Date(event.start);
                  var eventEnd = event.end ? new Date(event.end) : null;

                  if (status === "All") {
                    showEvent = true;
                  } else if (status === "Completed") {
                    showEvent = eventEnd
                      ? eventEnd < currentDate
                      : eventStart < currentDate;
                  } else if (status === "Ongoing") {
                    showEvent = eventEnd
                      ? eventStart <= currentDate && eventEnd >= currentDate
                      : eventStart <= currentDate;
                  } else if (status === "Upcoming") {
                    showEvent = eventStart > currentDate;
                  }
                }

                // Set the 'display' property of the event based on showEvent flag
                event.setProp("display", showEvent ? "auto" : "none");
              });
            }
          }

          // Add click event listener to the button
          populateStatusDropdown();
        },
      },
    },

    /**
     * Handle date click events.
     * @param {Object} info - Information about the clicked date.
     */
    dateClick: function (info) {
      if (permissions.scheduleMeeting) {
        const currentDate = new Date();
        const clickedDate = new Date(info.dateStr);
        document.getElementById("meeting_start_date").value = info.dateStr;
        document.getElementById("meeting_end_date").value = info.dateStr;

        // Prevent scheduling meetings on past dates
        if (
          currentEventType === "Meeting" &&
          clickedDate < currentDate.setHours(0, 0, 0, 0)
        ) {
          Swal.fire({
            icon: "warning",
            text: "You Can't Schedule the meeting on a past date",
          });
        } else if (currentEventType === "Meeting") {
          // Show the modal for scheduling a meeting
          $("#meetingModal").modal("show");
          document.getElementById("modalTitle").innerText = "Schedule meeting";
          $(
            "#eventDetails, #timeLogSection, #helpdetails, #groupdetails"
          ).hide();
          $("#scheduleMeetingForm").show();
          document.getElementById("formOperation").value = "insert";
        }
      }
    },

    /**
     * Handle the mounting of day cells to add tooltips.
     * @param {Object} arg - Information about the cell.
     */
    dayCellDidMount: function (arg) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const cellDate = arg.date;
    },

    /**
     * Handles event click events on the calendar.
     * @param {Object} info - Information about the clicked event.
     */
    eventClick: function (info) {
      var eventId = info.event.id;
      var numericValue = getNumericValue(eventId);
      var meetType = info.event.extendedProps.meetType;
      if (info.event.extendedProps.eventType === "Meeting") {
        clearModalContent();
        $.ajax({
          url:
            baseUrl + "meeting/eventdetails/" + numericValue + "/" + meetType,
          method: "POST",
          success: function (response) {
            if (
              response &&
              response.length > 0 &&
              response[0].cancel_reason == null
            ) {
              var meetingStarttime =
                response[0].meeting_start_date.split("-").reverse().join("-") +
                " " +
                response[0].meeting_start_time;
              var meetingEndtime =
                response[0].meeting_end_date +
                " " +
                response[0].meeting_end_time;
              var meetingLink = response[0].meeting_link;
              var meetingTime =
                formatToAmPm(response[0].meeting_start_time) +
                " - " +
                formatToAmPm(response[0].meeting_end_time);
              var deletedMeeting = response[0].is_deleted;
              var timeLogged = response[0].is_logged;
              var hostCreated = response[0].r_user_id;
              var iosEndTime = meetingEndtime.replace(" ", "T");
              // Show the meeting details modal
              $("#meetingModal").modal("show");
              document.getElementById("modalTitle").innerText =
                "Meeting Details";
              $(
                "#scheduleMeetingForm, #timeLogSection, #helpdetails, #groupdetails,#pcancel"
              ).hide();
              $(
                "#eventDetails,#peventdesc,#pmeetingLink,#peventMembers"
              ).show();
              document.getElementById("sprint_div").style.visibility =
                "visible";
              document.getElementById("eventTitle").innerText =
                response[0].meeting_title;
              document.getElementById("productName").innerText =
                response[0].product_name;
              document.getElementById("sprintName").innerText =
                response[0].sprint_name || "No Sprint Details";
              document.getElementById("eventDate").innerText =
                convertDateFormat(response[0].meeting_start_date);
              document.getElementById("eventdesc").innerText =
                response[0].meeting_description || "No description Provided";
              document.getElementById("eventHost").innerText =
                response[0].first_name;
              document.getElementById("eventduration").innerText =
                formatDuration(
                  response[0].meeting_start_time,
                  response[0].meeting_end_time
                );
              document.getElementById("eventStart").innerText = meetingTime;
              var linkElement = document.getElementById("meetingLink");
              var descriptionElement =
                document.getElementById("eventDescription");
              if (meetingLink) {
                linkElement.href = meetingLink;
                linkElement.target = "_blank";
                descriptionElement.innerText = meetingLink;
              } else {
                descriptionElement.innerText = "No link provided";
              }
              document.getElementById("eventMembers").innerText =
                response[1].meeting_members_names;
              document.querySelector("#eventDescription").href =
                meetingLink || "#";
              if (response[0].r_meeting_type_id == 2) {
                document.getElementById("viewDetails").style.display = "block";
                document.querySelector(".view-details a").innerHTML =
                  "<i class='far fa-eye'></i> backlog item details";
                document.querySelector(".view-details a").href =
                  baseUrl +
                  "backlog/backlogitemdetails?pid=" +
                  response[0].r_product_id +
                  "&pblid=" +
                  response[0].r_backlog_item_id;
              }

              if (
                response[0].r_meeting_type_id == 3 ||
                response[0].r_meeting_type_id == 4 ||
                response[0].r_meeting_type_id == 5
              ) {
                document.getElementById("viewDetails").style.display = "block";
                document.querySelector(".view-details a").innerHTML =
                  "<i class='far fa-eye'></i> View sprint details";
                document.querySelector(".view-details a").href =
                  baseUrl +
                  "sprint/navsprintview?sprint_id=" +
                  response[0].r_sprint_id;
              }

              if (
                new Date(meetingStarttime) <= new Date() &&
                deletedMeeting === "N" &&
                timeLogged === "N" &&
                sessionId == hostCreated
              ) {
                var timeLogButton = document.createElement("button");
                timeLogButton.innerText = "Time Log in Redmine";
                timeLogButton.classList.add(
                  "btn",
                  "btn-primary",
                  "me-1",
                  "mb-2"
                );

                timeLogButton.addEventListener("click", function () {
                  showTimeLogDetails(response[0], response[1]);
                });
                document
                  .getElementById("eventDetails")
                  .appendChild(timeLogButton);
              }

              if (
                new Date(iosEndTime) >= new Date() &&
                deletedMeeting === "N" &&
                sessionId == hostCreated
              ) {
                // Create the "Edit Meeting" button
                var editButton = document.createElement("button");
                editButton.innerText = "Edit meeting";
                editButton.classList.add("btn", "btn-primary", "me-1", "mb-2");

                editButton.addEventListener("click", function () {
                  editMeeting(response);
                });
              }
              // Check if the meeting start time is in the future
              if (
                new Date(meetingStarttime) > new Date() &&
                deletedMeeting === "N" &&
                sessionId == hostCreated
              ) {
                // Create the "Cancel Meeting" button

                var cancelButton = document.createElement("button");
                cancelButton.innerText = "Cancel meeting";
                cancelButton.classList.add("btn", "btn-danger", "me-1", "mb-2");
                cancelButton.id = "cancelButton"; // Add ID to cancelButton

                // Add event listener to the "Cancel Meeting" button
                cancelButton.addEventListener("click", function (event) {
                  event.preventDefault(); // Prevent the default action of the button
                  $("#meetingModal").modal("hide");
                  // Show a confirmation dialog with reason input for cancellation
                  Swal.fire({
                    title: "Cancel Meeting",
                    text: "Please provide a reason for the cancellation:",
                    icon: "warning",
                    input: "textarea",
                    inputPlaceholder: "Enter your reason here...",
                    inputAttributes: {
                      name: "cancellationReason",
                    },
                    showCancelButton: true,
                    cancelButtonText: "Back",
                    confirmButtonText: "Submit",
                    didOpen: () => {
                      const confirmButton = Swal.getConfirmButton();
                      confirmButton.name = "MeetingCancelReason";
                    },
                    // Validate the reason input before submitting
                    preConfirm: (reason) => {
                      if (!reason) {
                        Swal.showValidationMessage(
                          "Please enter a reason for the cancellation."
                        );
                        return false;
                      } else {
                        return new Promise((resolve) => {
                          $.ajax({
                            url:
                              baseUrl + "meeting/cancelMeeting/" + numericValue,
                            method: "POST",
                            data: {
                              reason: reason,
                            },
                            success: function (response) {
                              resolve(response);
                            },
                            error: function (xhr, status, error) {
                              console.error("AJAX Error:", error);
                              Swal.showValidationMessage(
                                "There was a problem submitting your reason. Please try again later."
                              );
                            },
                          });
                        });
                      }
                    },
                  }).then((result) => {
                    // If the reason is confirmed, show success message and reload the calendar
                    if (result.isConfirmed) {
                      Swal.fire({
                        title: "Meeting Cancelled",
                        text: "Your meeting has been cancelled.",
                        icon: "success",
                      }).then(() => {
                        window.location.href = window.location.href;
                      });
                    }
                  });
                });
                document.getElementById("eventDetails").appendChild(editButton);
                document
                  .getElementById("eventDetails")
                  .appendChild(cancelButton);
              }
            } else if (
              response &&
              response.length > 0 &&
              response[0].cancel_reason != null
            ) {
              var meetingName = response[0].meeting_title;
              var meetingStarttime =
                response[0].meeting_start_date.split("-").reverse().join("-") +
                " " +
                response[0].meeting_start_time;
              // var meetingEndtime = response[0].meeting_start_date + " " + response[0].meeting_end_time;
              var meetingLink = response[0].meeting_link;
              var meetingTime =
                formatToAmPm(response[0].meeting_start_time) +
                " - " +
                formatToAmPm(response[0].meeting_end_time);
              var deletedMeeting = response[0].is_deleted;

              // Show the meeting details modal
              $("#meetingModal").modal("show");
              document.getElementById("modalTitle").innerText =
                "Meeting Details";
              $(
                "#scheduleMeetingForm, #timeLogSection, #groupdetails, #helpdetails, #pmeetinglink, #peventMembers, #peventdesc, #groupdetails"
              ).hide();
              $("#eventDetails,#pcancel").show();
              document.getElementById("sprint_div").style.visibility =
                "visible";
              document.getElementById("eventTitle").innerText = meetingName;
              document.getElementById("productName").innerText =
                response[0].product_name;
              document.getElementById("sprintName").innerText =
                response[0].sprint_name || "No Sprint Details";
              document.getElementById("eventDate").innerText =
                response[0].meeting_start_date;
              document.getElementById("eventHost").innerText =
                response[0].first_name;
              document.getElementById("eventduration").innerText =
                formatDuration(
                  response[0].meeting_start_time,
                  response[0].meeting_end_time
                );
              document.getElementById("eventStart").innerText = meetingTime;
              document.getElementById("cancel").innerText =
                response[0].cancel_reason;
              document.getElementById("cancel").style.color = "red";
              document.getElementById("cancel").style.fontWeight = "700";
            } else {
              console.error("Empty or invalid response received.");
              // Handle the case where response is empty or not as expected
            }
          },
          error: function (error) {
            alert("An error occurred while fetching meeting detail.");
          },
        });
      } else {
        // Clear previous modal content
        clearModalContent();
        // Make an AJAX request to fetch sprint details
        $.ajax({
          url: baseUrl + "meeting/sprintdetails/" + numericValue,
          method: "POST",
          success: function (response) {
            // Check if the response is valid and contains data
            if (response && response.length > 0) {
              // Show the modal with sprint details
              $("#sprintModal").modal("show");
              document.getElementById("sprintModalLabel").innerText =
                "Sprint Details";

              // Sprint ID
              let sprintId = response[0].sprint_id;

              // Populate sprint details in the modal
              document.getElementById("sprintNames").innerText =
                response[0].sprint_name;
              document.getElementById("sprintCreator").innerText =
                response[0].first_name;
              document.getElementById("sprintProduct").innerText =
                response[0].product_name;
              document.getElementById("sprintCustomer").innerText =
                response[0].customer_name;
              document.getElementById("sprintDuration").innerText =
                response[0].sprint_duration_value;
              document.getElementById("startDate").innerText =
                response[0].start_date;
              document.getElementById("endDate").innerText =
                response[0].end_date;
              document.getElementById("sprintStatus").innerText =
                response[0].status_name;

              function restoreButtonListeners() {
                document.getElementById("changeStatusBtn").onclick =
                  function () {
                    document.getElementById("modalBody").innerHTML = `
                          <h5 class="modal-title">Change Status</h5>
                          <form id="changeStatusForm" class="mb-4">
                            <div class="row alterbutton">
                              <div class="col-md-5 mb-3">
                                <label for="newStatus" class="form-label">Sprint Status</label>
                              </div>
                              <div class="col-md-7">
                                <select class="form-select" name="newStatus" id="newStatus" required></select>
                              </div>
                            </div>
                            <div id="sprintButton">
                              <button type="button" class="btn btn-primary" id="backButton">Back</button>
                              <button type="submit" class="btn btn-primary">Confirm</button>
                            </div>
                          </form>
                        `;

                    var selectElement = document.getElementById("newStatus");
                    sprintStatus.forEach((status) => {
                      const option = document.createElement("option");
                      option.value = status.module_status_id;
                      option.textContent = status.status_name;
                      if (status.status_name === response[0].status_name) {
                        option.selected = true;
                      }
                      selectElement.appendChild(option);
                    });

                    $("#changeStatusForm").on("submit", function (e) {
                      e.preventDefault();
                      const newStatus = $("#newStatus").val();
                      $.ajax({
                        url:
                          baseUrl + "sprint/changeSprintStatusById/" + sprintId,
                        type: "POST",
                        data: {
                          newStatus: newStatus,
                        },
                        success: function (response) {
                          if (response.success === true) {
                            Swal.fire({
                              icon: "success",
                              title: "Sprint",
                              text: "Status Changed",
                              confirmButtonText: "OK",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                location.reload();
                              }
                            });
                          } else {
                            Swal.fire({
                              icon: "error",
                              title: "Sprint",
                              text: "Status Not Changed",
                              confirmButtonText: "OK",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                location.reload();
                              }
                            });
                          }
                        },
                        error: function (xhr, status, error) {
                          Swal.fire({
                            icon: "warning",
                            title: "Sprint",
                            text: "Something Went Wrong",
                            confirmButtonText: "OK",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              location.reload();
                            }
                          });
                        },
                      });
                    });

                    document.getElementById("backButton").onclick =
                      function () {
                        restoreSprintDetails();
                      };
                  };

                document.getElementById("viewDetailsLink").href =
                  baseUrl +
                  "sprint/navsprintview?sprint_id=" +
                  response[0].sprint_id;
              }

              function restoreSprintDetails() {
                let modalContent = `
                    <div id="sprintDetails" class="sprintDetails mb-4">
                        <p><b>Sprint name</b> <span>:</span> <span id="sprintNames">${response[0].sprint_name}</span></p>
                        <p><b>Sprint creator</b> <span>:</span> <span id="sprintCreator">${response[0].first_name}</span></p>
                        <p><b>Product name</b> <span>:</span> <span id="sprintProduct">${response[0].product_name}</span></p>
                        <p><b>Customer</b> <span>:</span> <span id="sprintCustomer">${response[0].customer_name}</span></p>
                        <p><b>Duration</b> <span>:</span> <span id="sprintDuration">${response[0].sprint_duration_value}</span></p>
                        <p><b>Start date</b> <span>: </span><span id="startDate">${response[0].start_date}</span></p>
                        <p><b>End date</b> <span>: </span><span id="endDate">${response[0].end_date}</span></p>
                        <p><b>Sprint status</b> <span>: </span><span id="sprintStatus">${response[0].status_name}</span></p>
                    </div>
                    <div class="button-container" id="orgButton">`;

                if (permissions.changestatus) {
                  modalContent += `
                        <button type="button" class="btn btn-primary" id="changeStatusBtn">
                            <i class="bi bi-check-square"></i> Change Status
                        </button>`;
                }

                modalContent += `
                    <a href="" id="viewDetailsLink">
                        <button type="button" class="btn btn-primary" id="viewDetailsBtn">
                            <i class="bi bi-eye"></i> View Details
                        </button>
                    </a>
                    </div>`;

                document.getElementById("modalBody").innerHTML = modalContent;

                restoreButtonListeners();
              }
              restoreButtonListeners();
            } else {
              // Handle the case where response is empty or not as expected
              console.error("Empty or invalid response received.");
            }
          },
          error: function (error) {
            alert("An error occurred while fetching sprint detail.");
          },
        });
      }
      /**
       * Show the time log details in the modal and entry for the log
       * @author Rama Selvan
       * @param {Object} meetingData - The data object containing meeting details.
       */

      function showTimeLogDetails(meetingData, meetingMembers) {
        // Set the modal title and display appropriate sections
        document.getElementById("modalTitle").innerText = "Time log details";
        $(
          "#scheduleMeetingForm, #eventDetails,  #helpdetails, #groupdetails"
        ).hide();
        $("#timeLogSection").show();
        const comments =
          meetingData.product_name +
          "," +
          meetingData.meeting_title +
          "," +
          meetingData.meeting_description;
        // Format meeting start and end times, duration
        const startTime = formatToAmPm(meetingData.meeting_start_time);
        const endTime = formatToAmPm(meetingData.meeting_end_time);
        const duration = calculateDurationInMinutes(
          meetingData.meeting_start_time,
          meetingData.meeting_end_time
        );
        const fractionalHours = convertMinutesToFractionalHours(duration);
        const formattedDuration = `${duration} Minutes (${fractionalHours})`;

        // Populate meeting details
        document.getElementById("mHost").innerText =
          meetingData.first_name || "N/A";
        document.getElementById("mName").innerText =
          meetingData.meeting_title || "N/A";
        document.getElementById("mDescription").innerText =
          meetingData.meeting_description || "N/A";
        document.getElementById("mDate").innerText =
          meetingData.meeting_start_date;
        document.getElementById("mstartTime").innerText = startTime;
        document.getElementById("mendTime").innerText = endTime;
        document.getElementById("mDuration").innerText = formattedDuration;
        document.getElementById("mProduct").innerText =
          meetingData.product_name || "N/A";
        document.getElementById("meetingIdHiddenInput").value =
          meetingData.meeting_details_id || "N/A";
        document.getElementById("comments").value = comments || "N/A";
        document.getElementById("sdate").value = meetingData.meeting_start_date;
        document.getElementById("product").value = meetingData.r_product_id;
        document.getElementById("mtype").value = meetingData.r_meeting_type_id;
        document.getElementById("sprintId").value = meetingData.r_sprint_id;

        const attendeesList = document.getElementById("attendeesList");
        attendeesList.innerHTML = ""; // Clear existing content

        if (
          meetingMembers.meeting_members_names &&
          meetingMembers.meeting_members_id
        ) {
          const names = meetingMembers.meeting_members_names.split(",");
          const ids = meetingMembers.meeting_members_id.split(",");

          if (names.length === ids.length) {
            names.forEach((attendee, index) => {
              const attendeeDiv = document.createElement("div");
              attendeeDiv.className = "d-flex align-items-center mb-3";
              attendeeDiv.innerHTML = `
                    <label style="color: #3949AB; width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
                      index + 1
                    }. ${attendee.trim()}</label>
                    <input type="hidden" name="attendees[${index}][id]" value="${ids[
                index
              ].trim()}">
                    <input type="hidden" name="attendees[${index}][name]" value="${attendee.trim()}">
                    <input type="number" name="attendees[${index}][hours]" class="form-control form-control-sm ml-2" placeholder="Hours" 
                           value="${fractionalHours}" step="0.25" min="0" max="24" style="width: 80px;">
                `;
              attendeesList.appendChild(attendeeDiv);
            });
          } else {
            attendeesList.innerHTML = "<p>No attendees found.</p>";
          }

          // Show the modal if it's not already visible
          if (!$("#meetingModal").is(":visible")) {
            $("#meetingModal").modal("show");
          }
        }
      }
      //
    },

    /**
     * Initialize the calendar with meeting and sprint events.
     */
    events: meetingDetails.map((meeting, index) => ({
      id: meeting.meeting_details_id,
      title: "Meeting",
      start: meeting.meeting_start_time,
      end: meeting.meeting_end_time,
      extendedProps: {
        eventType: "Meeting",
      },
    })),
    /**
     * Handle the rendering of calendar events with appropriate styles based on their properties.
     * @param {Object} info - The event info object provided by FullCalendar.
     */
    eventDidMount: function (info) {
      var currentDate = new Date();
      var start = new Date(info.event.start);
      var end = new Date(info.event.end);
      // Apply styles based on event type and timing
      if (info.event.extendedProps.eventType === "Meeting") {
        if (info.event.extendedProps.deleted === "N") {
          if (end < currentDate) {
            if (info.event.extendedProps.logged === "N") {
              info.el.style.backgroundColor = "red";
              info.el.style.color = "white";
            } else {
              info.el.style.backgroundColor = "#34be34";
              info.el.style.color = "white";
            }
          } else if (start <= currentDate && end >= currentDate) {
            info.el.style.backgroundColor = "#d85733";
            info.el.style.color = "white";
          } else if (start > currentDate) {
            info.el.style.backgroundColor = "#63a4ff";
            info.el.style.color = "white";
          }
        } else {
          info.el.style.backgroundColor = "#585858";
          info.el.style.color = "#c2c2c2";
          info.el.style.textDecoration = "line-through";
          info.el.style.textDecorationColor = "white";
        }
      } else if (info.event.extendedProps.eventType === "Sprint") {
        var statusName = info.event.extendedProps.statusName;
        // Apply styles based on sprint status

        if (statusName === "Sprint Completed") {
          info.el.style.backgroundColor = "#34be34";
          info.el.querySelector(".fc-event-title").style.color = "white";
        } else if (statusName === "Sprint Running") {
          info.el.style.backgroundColor = "#d85733";
          info.el.querySelector(".fc-event-title").style.color = "white";
        } else if (statusName === "Sprint Planned") {
          info.el.style.backgroundColor = "#63a4ff";
          info.el.querySelector(".fc-event-title").style.color = "white";
        }
      }
    },
  });

  function filterEvents() {
    calendar.refetchEvents();
  }

  // Render the calendar
  calendar.render();

  // Custom buttons for Product and Meeting dropdowns
  var customButtonEl1 = document.querySelector(".fc-ProductDropdown-button");
  var customButtonEl2 = document.querySelector(".fc-MeetingDropdown-button");
  var customButtonEl3 = document.querySelector(".fc-StatusDropdown-button");
  var customButtonEl4 = document.querySelector(".fc-MeetTypeDropdown-button");
  var customButtonEl5 = document.querySelector(".fc-HelpButton-button");

  // Set HTML content for the dropdown buttons
  customButtonEl1.innerHTML = `
  <div class="btn-group">
  <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Product</button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" id="productDropdown"></div>      
  </div>
  `;

  customButtonEl2.innerHTML = `
  <div class="btn-group">
  <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Events: Meeting</button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
  <a class="dropdown-item events" href="#" id="meeting-anchor"><i class="fas fa-users" style="margin-right: 10px;"></i>Meeting</a>
  <a class="dropdown-item events" href="#" id="sprint-dropdown"><i class="fas fa-tachometer-alt" style="margin-right: 10px;"></i>Sprint</a>
  </div>
  </div>
  `;
  // Initialize tooltips for the Meeting dropdown button and its items

  initializeTooltip(
    "#dropdownMenuButton2",
    "Filter Events by Meetings and Sprint",
    "top"
  );
  initializeTooltip("#meeting-anchor", "Filter by Meetings Schedules", "top");
  initializeTooltip("#sprint-dropdown", "Filter by Sprints Status", "left");

  customButtonEl3.innerHTML = `
  <div class="btn-group">
  <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Status</button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton3" id="statusDropdown">
  <a class="dropdown-item status" href="#" id="">All</a>
  <a class="dropdown-item status cls-complete" href="#" id="">Completed</a>
  <a class="dropdown-item status cls-going" href="#" id="">Ongoing</a>
  <a class="dropdown-item status cls-upcoming" href="#" id="">Upcoming</a>
  </div>
  </div>
  `;
  initializeTooltip("#dropdownMenuButton3", "Filter by Status", "top");

  customButtonEl4.innerHTML = `
  <div class="btn-group">
  <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton4" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">MeetType</button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton4" id="meetTypeDropdown"></div>
  </div>
  `;

  customButtonEl5.innerHTML = `
  <div class="btn-group">
  <button class="help-button" type="button" id="helpButton" onclick="showEventDetailsModal();"><i class="fas fa-question"></i></button>
  </div>
  `;
  initializeTooltip("#helpButton", "How to use calendar", "top");
  initializeTooltip("#dropdownMenuButton4", "Filter by MeetType", "top");

  if (!permissions.groupButton) {
    document.querySelector(
      ".fc-GroupButton-button.fc-button.fc-button-primary"
    ).style.display = "none";
  }
  if (permissions.groupButton) {
    var customButtonEl6 = document.querySelector(".fc-GroupButton-button");

    customButtonEl6.innerHTML = `
          <div class="btn-group">
          <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton5" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Group</button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton5" id="groupDropdown">
          <div class="btn-group">
              <button class="dropdown-item" type="button" name="createGroupButton" id="createGroupButton" onclick="createGroup();"><i class="fas fa-user-friends"></i> Create group</button>
          </div>
          <div class="btn-group">
              <button class="dropdown-item" type="button" name="GroupEditbutton" id="GroupEditbutton"  onclick="editGroup();"><i class="fas fa-pencil-alt"></i> Edit group</button>
          </div>
          <div class="btn-group">
              <button class="dropdown-item" type="button" name="GroupDeletebutton" id="GroupDeletebutton"  onclick="DeleteGroup();"><i class="fas fa-times-circle"></i> Delete group</button>
          </div>
          </div>
          </div>`;
  }

  initializeTooltip(
    "#dropdownMenuButton5",
    "Create / Edit Group for Meetings",
    "top"
  );

  // Initial Visibility
  // Hide the dropdown buttons
  document.querySelector(".fc-ProductDropdown-button").style.display = "none";
  document.querySelector(".fc-MeetTypeDropdown-button").style.display = "block";

  // Event Handlers
  document
    .getElementById("meeting-anchor")
    .addEventListener("click", function () {
      document.querySelector(".fc-ProductDropdown-button").style.display =
        "none";
      document.querySelector(".fc-MeetTypeDropdown-button").style.display =
        "block";
    });

  document
    .getElementById("sprint-dropdown")
    .addEventListener("click", function () {
      document.querySelector(".fc-ProductDropdown-button").style.display =
        "block";
      document.querySelector(".fc-MeetTypeDropdown-button").style.display =
        "none";
    });

  // Event listeners for the custom dropdown options for product
  document.querySelectorAll(".dropdown-item.meetType").forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("dropdownMenuButton4").innerHTML =
        "<b>MeetType</b>: " + this.innerText;
    });
  });

  // Event listeners for the custom dropdown options for product
  document.querySelectorAll(".dropdown-item.product").forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("dropdownMenuButton1").innerHTML =
        "<b>Product</b>: " + this.textContent;
    });
  });

  // Event listeners for the custom dropdown options for status
  document.querySelectorAll(".dropdown-item.status").forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("dropdownMenuButton3").innerHTML =
        "<b>Status</b>: " + this.innerText;
    });
  });

  // Event listeners for the custom dropdown options for events
  document.querySelectorAll(".dropdown-item.events").forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("dropdownMenuButton2").innerHTML =
        "<b>Events</b>: " + this.innerText;
      currentEventType = this.innerText; // Update the currentEventType based on selection

      if (this.innerText === "Sprint") {
        showSprint(sprintDetails);
      } else if (this.innerText === "Meeting") {
        showMeetings(meetingDetails);
      }
    });
  });

  /**
   * Show initial meetings on the calendar.
   * @param {Array} meetingDetails - An array of meeting detail objects.
   */
  showMeetings(meetingDetails);
  /**
   * Functions to show meetings on the calendar.
   * @param {Array} meetingDetails - An array of meeting detail objects.
   */
  function showMeetings(meetingDetails) {
    // Remove all existing events from the calendar
    calendar.removeAllEvents();
    currentEventType = "Meeting";
    for (let i = 0; i < meetingDetails.length; i++) {
      const meeting = meetingDetails[i];
      addEvent(
        `meeting-event-${meeting.meeting_details_id}`,
        meeting.meeting_type_name +
          " - " +
          formatToAmPm(meeting.meeting_start_time),
        meeting.meeting_start_date + " " + meeting.meeting_start_time,
        meeting.meeting_start_date + " " + meeting.meeting_end_time,
        "Meeting",
        meeting.r_meeting_type_id,
        meeting.is_deleted,
        meeting.is_logged
      );
    }
  }
  /**
   * Functions to show sprint details on the calendar.
   * @param {Array} sprintDetails - An array of sprint detail objects.
   */
  function showSprint(sprintDetails) {
    calendar.removeAllEvents(); // Remove all existing events
    currentEventType = "Sprint"; // Set the current event type to Sprint

    sprintDetails.forEach((sprint) => {
      const statusName = sprint.status_name;
      const sprintName =
        capitalizeFirstLetter(sprint.sprint_name) +
        "->" +
        capitalizeFirstLetter(sprint.product_name);
      let startDate = new Date(sprint.start_date);
      let endDate = new Date(sprint.end_date);
      const eventType = "Sprint";

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          // Skip weekends
          addEvent(
            `sprint-event-${sprint.sprint_id}`, // Unique ID for each sprint
            sprintName,
            new Date(currentDate).toISOString(),
            new Date(currentDate).toISOString(), // Same day event for each valid day
            eventType,
            statusName,
            sprint.is_deleted,
            sprint.is_logged
          );
        }
        currentDate.setDate(currentDate.getDate() + 1); // Move to next day
      }
    });
  }

  /**
   * Add events to the calendar.
   * @param {string} id - Unique ID for the event.
   * @param {string} title - Title of the event.
   * @param {string} start - Start date and time of the event.
   * @param {string} end - End date and time of the event.
   * @param {string} eventType - Type of the event (e.g., "Meeting" or "Sprint").
   * @param {string} [statusName] - Status name for the event (applicable for Sprint events).
   */
  function addEvent(
    id,
    title,
    start,
    end,
    eventType,
    statusName,
    deleted,
    logged
  ) {
    if (eventType === "Meeting") {
      calendar.addEvent({
        id: id,
        title: title,
        start: start,
        end: end,
        meetType: statusName,
        deleted: deleted,
        logged: logged,
        extendedProps: {
          eventType: eventType,
        },
      });
    } else {
      calendar.addEvent({
        id: id,
        title: title,
        start: start,
        end: end,
        statusName: statusName,
        extendedProps: {
          eventType: eventType,
        },
      });
    }
  }
});

/**
 * Extract numeric value from an event ID string.
 * @param {string} eventId - The event ID string.
 * @returns {number} - The numeric value extracted from the event ID.
 */
function getNumericValue(eventId) {
  return parseInt(eventId.match(/\d+$/)[0], 10);
}

/**
 * Clears the content of the modal.
 */
function clearModalContent() {
  document.getElementById("modalTitle").innerText = "";
  document.getElementById("eventTitle").innerText = "";
  document.getElementById("eventStart").innerText = "";
  document.getElementById("eventDescription").innerText = "";
  document.querySelector("#eventDescription").href = "#";
  document.getElementById("eventDetails").style.display = "none";
  document.getElementById("scheduleMeetingForm").style.display = "none";
  document.getElementById("groupdetails").style.display = "none";

  // Remove all buttons within event details section
  var buttons = document.querySelectorAll("#eventDetails button");
  buttons.forEach(function (button) {
    button.remove();
  });
  var buttons = document.querySelectorAll("#sprintDetails button");
  buttons.forEach(function (button) {
    button.remove();
  });
}

/**
 * Handles the edit meeting logic.
 * @param {Array} meeting - An array containing meeting details and members.
 */
function editMeeting(meeting) {
  clearModalContent();
  document.getElementById("modalTitle").innerText = "Edit meeting";
  $("#timeLogSection, #eventDetails, #helpdetails, #groupdetails").hide();
  $("#scheduleMeetingForm").show();
  document.getElementById("formOperation").value = "update";

  // Pre-fill the form with the meeting details
  document.getElementById("meeting_details_id").value =
    meeting[0].meeting_details_id;
  document.getElementById("meeting_title").value = meeting[0].meeting_title;
  document.getElementById("meeting_start_date").value =
    meeting[0].meeting_start_date.split("-").reverse().join("-");
  document.getElementById("meeting_end_date").value =
    meeting[0].meeting_end_date;
  document.getElementById("meeting_type").value = meeting[0].r_meeting_type_id;
  document.getElementById("product_div").value = meeting[0].r_product_id;

  let selectSprint = document.getElementById("spId");
  var option = document.createElement("option");
  if (meeting[0].r_sprint_id) {
    option.text = meeting[0].sprint_name;
    option.value = meeting[0].r_sprint_id;
    selectSprint.appendChild(option);
    selectSprint.value = meeting[0].r_sprint_id;
  } else {
    option.text = "No Sprint";
    option.value = "";
    selectSprint.appendChild(option);
    selectSprint.value = "";
  }

  const prefillForm = (duration) => {
    const [hours, minutes] = duration.split(":");
    document.getElementById("meeting_duration_hours").value = parseInt(
      hours,
      10
    );
    document.getElementById("meeting_duration_minutes").value = parseInt(
      minutes,
      10
    );
  };

  var durations = meeting[0].meeting_duration;
  prefillForm(durations);
  var starttime = (document.getElementById("startTimeSelect").value =
    meeting[0].meeting_start_time);
  var convertStartTime = convertDurationToMinutes(starttime);
  document.getElementById("startTimeSelect").value = convertStartTime;
  var endtime = (document.getElementById("endTimeSelect").value =
    meeting[0].meeting_end_time);
  var convertEndTime = convertDurationToMinutes(endtime);
  document.getElementById("endTimeSelect").value = convertEndTime;
  document.getElementById("meeting_location").value =
    meeting[0].r_meeting_location_id;
  document.getElementById("meeting_link").value = meeting[0].meeting_link;
  document.getElementById("meeting_description").value =
    meeting[0].meeting_description;
  var meetingMembersString = meeting[1].meeting_members_names;
  var selectedEmails = meetingMembersString.split(",");

  // Get the input and container elements
  var selectedEmailsInput = document.getElementById("selectedEmailsInput");
  var selectedEmailsContainer = document.getElementById("selectedEmails");

  // Clear the container and set the input value
  selectedEmailsContainer.innerHTML = "";
  selectedEmailsInput.value = selectedEmails.join(",");

  // Loop through the selected emails and create labels for each
  selectedEmails.forEach(function (email) {
    var label = document.createElement("div");
    label.classList.add("selected-email");
    label.innerHTML = `
      <span>${email.trim()}</span>
      <span class="remove-email" onclick="removeEmail(this)">x</span>`;
    selectedEmailsContainer.appendChild(label);
  });
  var isRecurring = meeting[0].recurrance_meeting_id != null;
  var updateAsSeriesDiv = document.getElementById("updateAsSeriesDiv");
  if (isRecurring) {
    updateAsSeriesDiv.style.display = "block";
    document.getElementById("recurranceId").value =
      meeting[0].recurrance_meeting_id;
  } else {
    updateAsSeriesDiv.style.display = "none";
    document.getElementById("recurranceId").value = "";
  }
}

/**
 * Converts a duration string in the format "HH:MM:SS" to minutes.
 * @param {string} duration - The duration string.
 * @returns {number} - The total duration in minutes.
 */
function convertDurationToMinutes(name) {
  var timeParts = name.split(":");
  var hours = parseInt(timeParts[0], 10);
  var minutes = parseInt(timeParts[1], 10);
  var seconds = parseInt(timeParts[2], 10);
  var totalMinutes = hours * 60 + minutes + seconds / 60;
  return totalMinutes;
}

/**
 * Removes an email from the selected emails list.
 * @param {HTMLElement} element - The element to be removed.
 */
function removeEmail(element) {
  var email = element.previousElementSibling.innerText;
  var selectedEmailsInput = document.getElementById("selectedEmailsInput");
  var selectedEmails = selectedEmailsInput.value.split(",");
  selectedEmails = selectedEmails.filter(function (e) {
    // Remove the email from the array
    return e !== email;
  });
  selectedEmailsInput.value = selectedEmails.join(",");
  element.parentElement.remove();
}

/**
 * Form validation using Bootstrap's custom validation styles.
 * Immediately invoked function to add validation to forms.
 */
$(document).ready(function () {
  function resetForm(formId) {
    var form = $("#" + formId)[0];
    form.reset();
    form.classList.remove("was-validated");
    $(form).find(".invalid-feedback").hide();
    $(form).find(".is-invalid").removeClass("is-invalid");
    if (formId === "meetingForm") {
      $("#selectedEmails").empty();
    }
  }

  $("#meetingModal").on("hidden.bs.modal", function (e) {
    var modalTitle = document.getElementById("modalTitle").innerText;
    if (
      modalTitle === "Edit meeting" ||
      modalTitle === "Schedule meeting" ||
      modalTitle === "Create group for meeting" ||
      modalTitle === "Edit group for meeting" ||
      modalTitle === "Delete group for meeting"
    ) {
      resetForm("meetingForm");
      resetForm("groupForm");
      $("#memberTableBody").empty();
    }
  });

  (function () {
    "use strict";
    var forms = document.querySelectorAll(".needs-validation");
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  })();
});

//updated by Ruban
// Email selection and filtering functionality
var selectedEmailsInput = document.getElementById("selectedEmailsInput");
/**
 * Filters the list of emails based on user input.
 * @param {Event} event - The input event triggered by the user.
 */
function filterEmails(event) {
  var input, filter, div, labels, i, txtValue;
  input = document.getElementById("teamInput");
  filter = input.value.trim().toUpperCase();
  div = document.getElementById("emailDropdown");
  labels = div.getElementsByClassName("email-option");
  var hasMatch = false;
  var matchCount = 0;
  for (i = 0; i < labels.length; i++) {
    txtValue = labels[i].textContent.trim().toUpperCase();
    if (txtValue.startsWith(filter) && matchCount < 4) {
      labels[i].style.display = "";
      hasMatch = true;
      matchCount++;
    } else {
      labels[i].style.display = "none";
    }
  }
  if (hasMatch && filter.length > 0) {
    div.classList.add("show");
  } else {
    div.classList.remove("show");
  }
  // Handle arrow key (Tab or Right Arrow) selection
  if (event.key === "ArrowRight" || event.key === "Tab") {
    autofillInput(filter);
  }
  // Check if Enter key is pressed
  if (event.key === "Enter") {
    addFirstMatchingEmail(filter);
  }
}
// Attach click event listener to the dropdown labels
document
  .getElementById("emailDropdown")
  .addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("email-option")) {
      var email = e.target.textContent.trim();
      updateSelectedEmails(email);
      document.getElementById("teamInput").value = ""; // Clear the input after adding
      this.classList.remove("show"); // Hide dropdown after selection
    }
  });

/**
 * Autofills the input with the first matching email when the arrow key is pressed.
 * @param {string} filter - The filter string to match the email.
 */
function autofillInput(filter) {
  var div = document.getElementById("emailDropdown");
  var labels = div.getElementsByClassName("email-option");

  // Find the first matching label
  for (var i = 0; i < labels.length; i++) {
    var txtValue = labels[i].textContent.trim().toUpperCase();
    if (txtValue.startsWith(filter)) {
      var email = labels[i].textContent.trim();
      document.getElementById("teamInput").value = email; // Autofill input with the first matching email
      return;
    }
  }
}

/**
 * Adds the first matching email to the selected emails list when Enter key is pressed.
 * @param {string} filter - The filter string to match the email.
 */
function addFirstMatchingEmail(filter) {
  var div = document.getElementById("emailDropdown");
  var labels = div.getElementsByClassName("email-option");

  // Find the first matching label
  for (var i = 0; i < labels.length; i++) {
    var txtValue = labels[i].textContent.trim().toUpperCase();
    if (txtValue.startsWith(filter)) {
      var email = labels[i].textContent.trim();
      updateSelectedEmails(email);
      document.getElementById("teamInput").value = ""; // Clear the input after adding
      div.classList.remove("show"); // Hide dropdown after selection
      return;
    }
  }
}
/**
 * Updates the list of selected emails.
 * @param {string} email - The email to be added to the selected list.
 */

function updateSelectedEmails(email) {
  // Check if email is already selected
  var selectedEmails = selectedEmailsInput.value.split(",");
  if (selectedEmails.includes(email)) {
    return; // Do nothing if email is already selected
  }

  // Add the selected email
  selectedEmails.push(email);
  selectedEmailsInput.value = selectedEmails.join(",");

  // Update UI to show selected email
  var selectedEmailsContainer = document.getElementById("selectedEmails");
  var label = document.createElement("div");
  label.classList.add("selected-email");
  label.innerHTML = `
      <span>${email}</span>
      <span class="remove-email" onclick="removeSelectedEmail(this, '${email}')">&times;</span>`;
  selectedEmailsContainer.appendChild(label);
}

/**
 * Removes an email from the selected list.
 * @param {HTMLElement} element - The element to be removed.
 * @param {string} email - The email to be removed from the selected list.
 */
function removeSelectedEmail(element, email) {
  var selectedEmailsDiv = document.getElementById("selectedEmails");
  while (!element.classList.contains("selected-email")) {
    element = element.parentNode;
  }
  element.remove();

  // Remove email from selected emails input
  var selectedEmails = selectedEmailsInput.value.split(",");
  var index = selectedEmails.indexOf(email);
  if (index !== -1) {
    selectedEmails.splice(index, 1);
    selectedEmailsInput.value = selectedEmails.join(",");
  }
}

/**
 * Adds keyup and keydown event listeners to the team input field.
 * Filters emails and prevents form submission on Enter key press.
 */
document
  .getElementById("teamInput")
  .addEventListener("keyup", function (event) {
    filterEmails(event);
  });

document
  .getElementById("teamInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission on Enter key press
    }
  });

/**
 * Initializes the time select elements when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  const startTimeSelect = document.getElementById("startTimeSelect");
  const durationHoursInput = document.getElementById("meeting_duration_hours");
  const durationMinutesInput = document.getElementById(
    "meeting_duration_minutes"
  );
  const endTimeSelect = document.getElementById("endTimeSelect");
  const startDateInput = document.getElementById("meeting_start_date");
  const endDateInput = document.getElementById("meeting_end_date");

  /**
   * Formats time in hh:mm AM/PM format.
   * @param {number} minutes - The total minutes to be converted to time format.
   * @returns {string} - The formatted time string.
   */
  const formatTime = (minutes) => {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    mins = mins < 10 ? "0" + mins : mins;
    return `${hours}:${mins}${period}`;
  };

  /**
   * Fills select elements with time options in 15-minute intervals.
   * @param {HTMLSelectElement} select - The select element to fill with time options.
   * @param {number} [startMinutes=0] - The starting minutes for time options.
   */
  const fillTimeOptions = (select, startMinutes = 0) => {
    let options = "";
    for (let i = startMinutes; i < 24 * 60; i += 15) {
      const time = formatTime(i);
      options += '<option value="' + i + '">' + time + "</option>";
    }
    select.innerHTML = options;
  };

  /**
   * Sets the start time select element to the current time rounded to the nearest quarter-hour.
   * @param {HTMLSelectElement} selectElement - The select element to set to the current time.
   */
  const setStartTimeToCurrent = (selectElement) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const nearestQuarter = Math.ceil(currentMinutes / 15) * 15;
    selectElement.value = nearestQuarter % (24 * 60);
  };

  /**
   * Updates the end time and end date based on the selected start time and duration.
   */
  const updateEndTime = () => {
    const startTimeValue = parseInt(startTimeSelect.value);
    const durationHours = parseInt(durationHoursInput.value);
    const durationMinutes = parseInt(durationMinutesInput.value);
    const durationValue = durationHours * 60 + durationMinutes;

    if (!isNaN(startTimeValue) && !isNaN(durationValue)) {
      const endTimeValue = (startTimeValue + durationValue) % (24 * 60);
      const endDateOffset = Math.floor(
        (startTimeValue + durationValue) / (24 * 60)
      );
      const startDate = new Date(startDateInput.value);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + endDateOffset);

      endTimeSelect.innerHTML = ""; // Clear existing options
      const time = formatTime(endTimeValue);
      let option = document.createElement("option");
      option.value = endTimeValue;
      option.textContent = time;
      endTimeSelect.appendChild(option);
      endTimeSelect.value = endTimeValue; // Set the end time value

      // Update the end date input
      endDateInput.value = endDate.toISOString().split("T")[0];
    } else {
      endTimeSelect.innerHTML = '<option value="">Select the End time</option>';
      fillTimeOptions(endTimeSelect, parseInt(startTimeSelect.value) + 15);
    }
  };

  // Event listeners to update end time when start time or duration changes
  startTimeSelect.addEventListener("change", updateEndTime);
  durationHoursInput.addEventListener("change", updateEndTime);
  durationMinutesInput.addEventListener("change", updateEndTime);
  startDateInput.addEventListener("change", updateEndTime);

  // Initialize the time options and set the start time to current time
  fillTimeOptions(startTimeSelect);
  fillTimeOptions(endTimeSelect);
  setStartTimeToCurrent(startTimeSelect);

  /**
   * Pre-fills the form for editing a meeting with the given start time and duration.
   * @param {number} startTime - The start time in minutes.
   * @param {number} duration - The duration in minutes.
   */
  const prefillForm = (startTime, duration) => {
    startTimeSelect.value = startTime;
    durationHoursInput.value = Math.floor(duration / 60);
    durationMinutesInput.value = duration % 60;
    updateEndTime();
  };
});

/**
 * Capitalizes the first letter of each word in the given string.
 * @param {string} string - The string to be capitalized.
 * @returns {string} - The capitalized string.
 */
function capitalizeFirstLetter(string) {
  return string.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
/**
 * Filters and refetches events from the calendar.
 */
function filterEvents() {
  calendar.refetchEvents();
}
/**
 * Formats a date-time string to a 12-hour time format.
 * @param {string} dateTimeString - The date-time string to be formatted.
 * @returns {string} - The formatted time string.
 */
function formatTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

/**
 * Calculates duration between two time strings in minutes.
 * @param {string} startTimeString - Start time in "HH:MM:SS" format.
 * @param {string} endTimeString - End time in "HH:MM:SS" format.
 * @returns {number} - The duration in minutes.
 */
function calculateDurationInMinutes(startTimeString, endTimeString) {
  const start = new Date(`1970-01-01T${startTimeString}Z`);
  const end = new Date(`1970-01-01T${endTimeString}Z`);
  const durationMs = end - start;
  return Math.round(durationMs / (1000 * 60));
}
/**
 * Converts time from hh:mm:ss format to h:mm AM/PM format.
 * @param {string} timeString - The time string in hh:mm:ss format.
 * @returns {string} - The formatted time string in h:mm AM/PM format.
 */
function formatToAmPm(timeString) {
  // Split the time string into hours, minutes, and seconds
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Determine AM or PM period
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  // Format minutes with leading zero if necessary
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  // Return formatted time string
  return `${formattedHours}:${formattedMinutes} ${period}`;
}

/**
 * Converts minutes to fractional hours for RedMinE LOG.
 *
 * This function takes a duration in minutes and converts it to fractional hours.
 * For example, 60 minutes will be converted to 1, 30 minutes will be converted to 0.5,
 * 45 minutes will be converted to 0.75, and 120 minutes will be converted to 2.
 *
 * @param {number} minutes - The duration in minutes.
 * @returns {number} - The duration in fractional hours.
 */

function convertMinutesToFractionalHours(minutes) {
  return minutes / 60;
}

function combineMembersAndIds(names, ids) {
  if (names.length !== ids.length) {
    console.error("Names and IDs arrays must have the same length.");
    return [];
  }

  return names.map((name, index) => ({
    meeting_members_names: name,
    meeting_members_id: ids[index],
  }));
}

function showEventDetailsModal() {
  $("#meetingModal").modal("show");
  $(
    "#scheduleMeetingForm, #eventDetails, #timeLogSection, #helpdetails, #groupdetails"
  ).hide();
  $("#helpdetails").show();
  document.getElementById("modalTitle").innerText = "How to use the calendar";
}

function getIconClass(status) {
  switch (status) {
    case "All":
      return "fas fa-list";
    case "Completed":
      return "fas fa-check-circle";
    case "Ongoing":
      return "fas fa-spinner";
    case "Upcoming":
      return "fas fa-calendar-alt";
    case "Sprint Completed":
      return "fas fa-check-circle";
    case "Sprint Running":
      return "fas fa-spinner";
    case "Sprint Planned":
      return "fas fa-calendar-alt";
    case "On Hold":
      return "fas fa-pause-circle";
    case "General":
      return "fas fa-users";
    case "Brainstorming":
      return "fas fa-lightbulb";
    case "Daily Scrum":
      return "fas fa-sync-alt";
    case "Sprint Review":
      return "fas fa-check";
    case "Sprint Retrospective":
      return "fas fa-undo";
    default:
      return "fas fa-circle";
  }
}

function formatDuration(meeting_start_time, meeting_end_time) {
  // Convert times to Date objects for easy calculation
  const start = new Date(`1970-01-01T${meeting_start_time}`);
  const end = new Date(`1970-01-01T${meeting_end_time}`);

  // Calculate the difference in milliseconds
  const diff = end - start;

  // Convert milliseconds to hours, minutes, and seconds
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
        minutes > 1 ? "s" : ""
      }`;
    } else {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    }
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
  } else {
    return "0 minutes";
  }
}

$(document).ready(function () {
  $("#meetingForm").on("submit", function (e) {
    e.preventDefault();

    let formData = $(this).serialize();
    formData += "&Schedulebutton=1";
    let operation = $("#formOperation").val();
    let url =
      operation === "insert"
        ? baseUrl + "meeting/scheduleMeeting"
        : baseUrl + "meeting/updateMeeting";

    $.ajax({
      url: url,
      method: "POST",
      data: formData,
      dataType: "json",
      success: function (response) {
        if (response.errors) {
          var errorMessage = "";
          for (var field in response.errors) {
            errorMessage += response.errors[field] + "<br>";
          }
          Swal.fire({
            title: "Validation Error!",
            html: errorMessage,
            icon: "error",
            confirmButtonText: "OK",
          });
        } else if (response.conflict) {
          showToast(response.conflictMembers);
        } else if (response.members) {
          Swal.fire({
            title: "Warning",
            text: "Select a group or add a member to schedule",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else if (response.success) {
          if (response.mail) {
            Swal.fire({
              title: "Success!",
              text: "Meeting scheduled and Email notification sent",
              icon: "success",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = window.location.href;
              }
            });
          } else {
            // Handle error if email sending fails
            Swal.fire({
              title: "Warning",
              text: "Meeting scheduled but Email notification failed",
              icon: "warning",
              confirmButtonText: "OK",
            });
          }
        } else {
          Swal.fire({
            title: "Error!",
            text:
              response.message ||
              (operation === "insert"
                ? "Failed to Schedule Meeting"
                : "Failed to Update Meeting"),
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      },
      error: function () {
        // Handle AJAX error
        Swal.fire({
          title: "Error",
          text: "An error occurred while Scheduling Meeting",
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });
  });
});

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months start at 0
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
document.addEventListener("DOMContentLoaded", function () {
  const meetingDateInput = document.getElementById("meeting_start_date");
  const todayDate = getTodayDate();
  flatpickr(meetingDateInput, {
    minDate: todayDate,
    dateFormat: "Y-m-d",
  });
});

const rowsPerPage = 8;
let currentPage = 1;
const selectedMembers = new Set();

function updateDisplayedMembers() {
  const searchValue = $("#memberSearch").val().toLowerCase();
  const rows = $("#memberTableBody tr");
  const filteredRows = rows.filter(function () {
    return $(this).text().toLowerCase().indexOf(searchValue) > -1;
  });
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  rows.hide();
  filteredRows.each(function (index) {
    if (index >= start && index < end) {
      $(this).show();
    }
  });
  updateSelectAllCheckbox();
  updatePaginationButtons(filteredRows.length);
}

function updatePaginationButtons(totalFilteredRows) {
  const totalPages = Math.ceil(totalFilteredRows / rowsPerPage);
  const paginationControls = document.getElementById("paginationControls");
  paginationControls.innerHTML = "";
  const prevButton = document.createElement("button");
  prevButton.className = "btn btn-primary p-1 m-1";
  prevButton.style.borderRadius = "50%";
  prevButton.style.height = "25px";
  prevButton.style.width = "25px";
  prevButton.innerHTML =
    "<i class='fas fa-angle-left' style='font-size:24px; display:inline-block;'></i>";
  prevButton.disabled = currentPage <= 1;
  prevButton.addEventListener("click", function () {
    changePage(currentPage - 1);
  });
  const nextButton = document.createElement("button");
  nextButton.className = "btn btn-primary p-1 m-1";
  nextButton.style.borderRadius = "50%";
  nextButton.style.height = "25px";
  nextButton.style.width = "25px";
  nextButton.innerHTML =
    "<i class='fas fa-angle-right' style='font-size:24px'></i>";
  nextButton.disabled = currentPage >= totalPages;
  nextButton.addEventListener("click", function () {
    changePage(currentPage + 1);
  });
  paginationControls.appendChild(prevButton);
  paginationControls.appendChild(nextButton);
}

function updateSelectedMembers() {
  const pageRows = $("#memberTableBody tr:visible .memberCheckbox");
  pageRows.each(function () {
    const memberId = $(this).val();
    if ($(this).is(":checked")) {
      selectedMembers.add(memberId);
    } else {
      selectedMembers.delete(memberId);
    }
  });
  $("#selectedMembers").val(Array.from(selectedMembers).join(","));
}

function updateSelectAllCheckbox() {
  const totalCheckboxes = $(
    "#memberTableBody tr:visible .memberCheckbox"
  ).length;
  const checkedCheckboxes = $(
    "#memberTableBody tr:visible .memberCheckbox:checked"
  ).length;
  $("#selectAllMembers").prop(
    "checked",
    totalCheckboxes > 0 && totalCheckboxes === checkedCheckboxes
  );
}

$("#memberSearch").on("keyup", function () {
  currentPage = 1; // Reset to first page on new search
  updateDisplayedMembers();
});

$("#selectAllMembers").on("click", function () {
  const isChecked = $(this).prop("checked");
  $("#memberTableBody tr:visible .memberCheckbox").prop("checked", isChecked);
  $("#memberTableBody tr:visible .memberCheckbox").each(function () {
    const memberId = $(this).val();
    if (isChecked) {
      selectedMembers.add(memberId);
    } else {
      selectedMembers.delete(memberId);
    }
  });
  $("#selectedMembers").val(Array.from(selectedMembers).join(","));
});

$("#memberTableBody").on("change", ".memberCheckbox", function () {
  updateSelectedMembers();
  updateDisplayedMembers();
});

$("#memberTableBody").on("click", "tr", function (event) {
  if (!$(event.target).is(".memberCheckbox")) {
    const checkbox = $(this).find(".memberCheckbox");
    checkbox.prop("checked", !checkbox.prop("checked")).trigger("change");
  }
});

$("#selectedMembersDisplay").on("click", ".btn-close", function () {
  const id = $(this).data("id");
  $("#memberTableBody .memberCheckbox[value='" + id + "']")
    .prop("checked", false)
    .trigger("change");
  selectedMembers.delete(id);
  $("#selectedMembers").val(Array.from(selectedMembers).join(","));
  updateDisplayedMembers();
});

$(document).ready(function () {
  updateDisplayedMembers();
});

function changePage(newPage) {
  currentPage = newPage;
  updateDisplayedMembers();
}

function createGroup() {
  clearModalContent();
  $("#meetingModal").modal("show");
  $(
    "#scheduleMeetingForm, #eventDetails, #timeLogSection, #helpdetails, #editGroup"
  ).hide();
  $("#groupdetails, #productDetails").show();
  document.getElementById("modalTitle").innerText = "Create group for meeting";
  document.getElementById("groupbutton").innerText = "Create Group";
  const productData = JSON.parse(document.getElementById("productData").value);
  let options = productData
    .map(
      (product) =>
        `<option value="${product.external_project_id}">${product.product_name}</option>`
    )
    .join("");
  document.getElementById("productDetails").innerHTML = `
      <label for="productNames" class="form-label">Product</label>
      <select class="form-select" id="productNames" name="r_product_id" required>
          <option value="" disabled selected>Select the Product</option>
          ${options}
      </select>
      <div class="valid-feedback">Looks good!</div>
      <div class="invalid-feedback">Please choose a product.</div>
  `;

  document.getElementById("showDetails").innerHTML = `
      <label for="meeting_team_name" class="form-label">Group name</label>
      <input type="text" class="form-control" id="group_name" name="meeting_team_name" placeholder="Enter the Group Name" required>
      <div class="valid-feedback">Looks good!</div>
      <div class="invalid-feedback">Please provide a group name.</div>
  `;

  document.getElementById("memberDetails").style.display = "block";
  $(document).ready(function () {
    $("#productNames").change(function () {
      let productId = $(this).val();
      $("#groupProductId").val(productId);
      if (productId) {
        $("#groupIdByName").val(productId);
        $.ajax({
          url: baseUrl + "meeting/getMembersByProduct/" + productId,
          type: "POST",
          dataType: "json",
          success: function (data) {
            populateMemberTable(data);
            updateDisplayedMembers();
          },
          error: function (xhr, status, error) {
            console.error("Error:", error);
          },
        });
      }
    });
  });

  function populateMemberTable(team) {
    $("#memberTableBody").empty();
    team.members.forEach((member) => {
      $("#memberTableBody").append(`
              <tr>
                  <td><input type="checkbox" class="memberCheckbox" value="${member.external_employee_id}"></td>
                  <td>${member.first_name}</td>
              </tr>
          `);
    });
    let selectedMembers = team.members
      .filter((member) => member.isSelected)
      .map((member) => member.r_external_employee_id);
    $("#selectedMembers").val(selectedMembers.join(","));
  }
}

function editGroup() {
  clearModalContent();
  $("#meetingModal").modal("show");
  $(
    "#scheduleMeetingForm, #eventDetails, #timeLogSection, #helpdetails"
  ).hide();
  $("#groupdetails, #editGroup").show();
  document.getElementById("modalTitle").innerText = "Edit group for meeting";
  document.getElementById("groupbutton").innerText = "Edit Group";
  const groupData = JSON.parse(document.getElementById("groupData").value);
  let options = groupData
    .map(
      (group) =>
        `<option value="${group.meeting_team_id}">${group.meeting_team_name}</option>`
    )
    .join("");
  document.getElementById("productDetails").style.display = "none";
  document.getElementById("showDetails").innerHTML = `
      <div id="editGroupDiv">
          <label for="meeting_team_id" class="form-label">Group Name</label>
          <select class="form-select" id="groupSelect" name="meeting_team_id" required>
              <option value="">Select the Group Name</option>
              ${options}
          </select>
          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">Please choose a Group Name.</div>
      </div>
  `;
  document.getElementById("memberDetails").style.display = "block";

  $("#groupSelect").change(function () {
    let groupId = $(this).val();
    if (groupId) {
      $("#groupIdByName").val(groupId);
      $.ajax({
        url: baseUrl + "meeting/getTeamDetailsById/" + groupId,
        type: "POST",
        dataType: "json",
        success: function (data) {
          populateMemberTable(data);
        },
        error: function (xhr, status, error) {
          console.error("Error:", error);
        },
      });
    }
  });
}
function populateMemberTable(team) {
  $("#memberTableBody").empty();
  $("#paginationControls").empty();

  // Retrieve previously selected members from the hidden input field
  let previousSelectedIds = $("#selectedMembers")
    .val()
    .split(",")
    .filter(Boolean);

  // Get new selected members from the team
  let newSelectedIds = team.members.map(
    (member) => member.r_external_employee_id
  );

  // Combine previous and new selected members without duplicates
  let allSelectedIds = previousSelectedIds.concat(
    newSelectedIds.filter((id) => previousSelectedIds.indexOf(id) === -1)
  );

  let teamName = "";
  let productIds = team.members
    .map((member) => member.r_product_id)
    .filter((value, index, self) => self.indexOf(value) === index); // Unique product IDs

  if (productIds.length > 0) {
    document.getElementById("groupProductId").value = productIds[0];
  }

  let totalMembers = [];

  function handleAjaxResponse(data) {
    totalMembers = totalMembers.concat(data.members);
    populateTableRows();
  }

  function populateTableRows() {
    $("#memberTableBody").empty();
    totalMembers.forEach((productMember) => {
      const isChecked =
        allSelectedIds.indexOf(productMember.external_employee_id) !== -1;
      const $row = $(`
              <tr>
                  <td><input type="checkbox" class="memberCheckbox" value="${productMember.external_employee_id}"></td>
                  <td>${productMember.first_name}</td>
              </tr>
          `);
      $row.find(".memberCheckbox").prop("checked", isChecked);
      $("#memberTableBody").append($row);
    });
    // Update the hidden input with the current selections
    $("#selectedMembers").val(allSelectedIds.join(","));
    updateDisplayedMembers();
  }

  productIds.forEach((productId) => {
    $.ajax({
      url: baseUrl + "meeting/getMembersByProduct/" + productId,
      type: "POST",
      dataType: "json",
      success: function (data) {
        handleAjaxResponse(data);
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  });

  if (team.members.length > 0) {
    teamName = team.members[0].meeting_team_name;
  }

  $("#selectedMembers").val(allSelectedIds.join(","));
  document.getElementById("editGroup").innerHTML = `
      <div id="editGroupDiv">
          <label for="meeting_team_name" class="form-label">Edit Group Name</label>
          <input type="text" class="form-control" id="editGroupName" name="meeting_team_name" value="${teamName}" required>
          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">Please provide a Group Name.</div>
      </div>
  `;
}

$(document).ready(function () {
  $("#groupForm").on("submit", function (event) {
    event.preventDefault();
    updateSelectedMembers();
    const formData = new FormData(this);
    let buttonname = document.getElementById("groupbutton").innerText;
    let name = "";
    if (buttonname == "Create Group") {
      name = "createGroupDetails";
      submitForm(name, formData);
    } else if (buttonname == "Edit Group") {
      name = "editGroupDetails";
      submitForm(name, formData);
    } else if (buttonname == "Delete Group") {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          name = "deleteGroupDetails";
          submitForm(name, formData);
        }
      });
    }
  });

  function submitForm(actionName, formData) {
    let url = baseUrl + "meeting/" + actionName;
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.errors) {
          var errorMessage = "";
          for (var field in response.errors) {
            errorMessage += response.errors[field] + "<br>";
          }
          Swal.fire({
            title: "Validation Error!",
            html: errorMessage,
            icon: "error",
            confirmButtonColor: "#3949ab",
            confirmButtonText: "OK",
          });
        } else if (response.update) {
          Swal.fire({
            title: "Success!",
            text: "Group Updated Successfully",
            icon: "success",
            confirmButtonColor: "#3949ab",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = window.location.href;
            }
          });
        } else if (response.deleted === true) {
          Swal.fire({
            title: "Success!",
            text: "Group Deleted Successfully",
            icon: "success",
            confirmButtonColor: "#3949ab",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = window.location.href;
            }
          });
        } else if (response.deleted === false) {
          Swal.fire({
            title: "Warning!",
            text: "Failed to Delete a Group",
            icon: "warning",
            confirmButtonColor: "#3949ab",
            confirmButtonText: "OK",
          });
        } else if (response.empty === true) {
          Swal.fire({
            title: "Warning!",
            text: "Add members to the group",
            icon: "warning",
            confirmButtonColor: "#3949ab",
            confirmButtonText: "OK",
          });
        } else if (response.success) {
          Swal.fire({
            title: "Success!",
            text: "Group Created Successfully",
            icon: "success",
            confirmButtonColor: "#3949ab",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = window.location.href;
            }
          });
        } else {
          Swal.fire({
            title: "Warning",
            text: "Failed to create group for meeting",
            icon: "warning",
            confirmButtonColor: "#3949ab",
            confirmButtonText: "OK",
          });
        }
      },
      error: function (xhr, status, error) {
        Swal.fire({
          title: "Error",
          text: "An error occurred while creating the group",
          icon: "error",
          confirmButtonColor: "#3949ab",
          confirmButtonText: "OK",
        });
      },
    });
  }

  $("#selectAllMembers").on("change", function () {
    $(".memberCheckbox").prop("checked", this.checked);
  });
});

function DeleteGroup() {
  clearModalContent();
  $("#meetingModal").modal("show");
  $(
    "#scheduleMeetingForm, #eventDetails, #timeLogSection, #helpdetails, #editGroup, #memberDetails"
  ).hide();
  $("#groupdetails").show();
  document.getElementById("modalTitle").innerText = "Delete group for meeting";
  document.getElementById("groupbutton").innerText = "Delete Group";
  const groupData = JSON.parse(document.getElementById("groupData").value);
  let options = groupData
    .map(
      (group) =>
        `<option value="${group.meeting_team_id}">${group.meeting_team_name}</option>`
    )
    .join("");
  document.getElementById("productDetails").style.display = "none";
  document.getElementById("showDetails").innerHTML = `
          <div id="editGroupDiv">
              <label for="groupSelect" class="form-label">Group Name</label>
              <select class="form-select" id="groupSelect" name="groupSelect" required>
                  <option value="">Select the Group Name</option>
                  ${options}
              </select>
              <div class="valid-feedback">Looks good!</div>
              <div class="invalid-feedback">Please choose a meeting location.</div>
          </div>
  `;
}

$(document).ready(function () {
  $("#timeLogForm").on("submit", function (e) {
    e.preventDefault();
    let formData = $(this).serialize();
    formData += "&timelogbutton=1";
    let url = baseUrl + "meeting/logMeetingTimes";
    $.ajax({
      url: url,
      method: "POST",
      data: formData,
      dataType: "json",
      success: function (response) {
        if (response.success) {
          Swal.fire({
            title: "Success!",
            text: "Time Logged Successfully",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = window.location.href;
            }
          });
        }
      },
    });
  });

  // sprint input visible based on meeting type
  $(document).ready(function () {
    $("#meeting_type").on("change", function () {
      var selectedValue = $(this).find("option:selected").text();
      if (
        selectedValue === "Daily Scrum" ||
        selectedValue === "Sprint Review" ||
        selectedValue === "Sprint Retrospective"
      ) {
        $("#sprint_div").css("display", "block");
      } else {
        $("#sprint_div").css("display", "none");
      }
    });
  });

  $(document).ready(function () {
    $("#product_div").change(function () {
      let productId = $(this).val();
      $.ajax({
        url: baseUrl + "meeting/sprintByProduct/" + productId,
        type: "POST",
        dataType: "json",
        success: function (data) {
          let sprintSelect = $("#spId");
          sprintSelect.empty();
          if (data.length > 0) {
            sprintSelect.append(
              '<option value="" disabled selected>Select the Sprint</option>'
            );
            $.each(data, function (index, sprint) {
              sprintSelect.append(
                `<option value="${sprint.sprint_id}">${sprint.sprint_name}</option>`
              );
            });
          } else {
            sprintSelect.append(
              '<option value="" disabled selected style="color: red;">No sprints available for the selected product</option>'
            );
          }
          $("#sprint_div").css("visibility", "visible");
        },
        error: function (xhr, status, error) {
          console.error("Error:", error);
        },
      });
    });
  });
});

function showAddTeamMember() {
  document.getElementById("addTeamMemberSection").style.display = "block";
  document.getElementById("inviteGroupSection").style.display = "none";
}

function showInviteGroup() {
  document.getElementById("addTeamMemberSection").style.display = "none";
  document.getElementById("inviteGroupSection").style.display = "block";
}

$("#product_div").change(function () {
  let productId = $(this).val();
  $.ajax({
    url: baseUrl + "meeting/backlogByProduct/" + productId,
    type: "POST",
    dataType: "json",
    success: function (data) {
      let backlogSelect = $("#backlog");
      backlogSelect.empty();
      if (data.length === 0) {
        backlogSelect.append(
          `<option class="text-danger" disabled selected>No backlog</option>`
        );
      } else {
        backlogSelect.append(
          `<option disabled selected>Select the backlog</option>`
        );
        $.each(data, function (index, backlog) {
          backlogSelect.append(
            `<option value="${backlog.backlog_item_id}">${backlog.backlog_item_name}</option>`
          );
        });
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
});

$(document).ready(function () {
  $("#backlog").change(function () {
    let backlogId = $(this).val();
    $.ajax({
      url: baseUrl + "meeting/epicByBacklog/" + backlogId,
      type: "POST",
      dataType: "json",
      success: function (data) {
        let epicContainer = $("#epic-checkbox-container");
        epicContainer.empty();
        if (data.length === 0) {
          epicContainer.append(
            `<label class="dropdown-item px-3 text-danger">No epics available.</label>`
          );
        } else {
          $.each(data, function (index, backlog) {
            epicContainer.append(
              `<label class="dropdown-item px-3">
                                <input type="checkbox" class="epic-checkbox"
                                value="${backlog.epic_id}" data-description="${backlog.epic_description}"> ${backlog.epic_description}
                              </label>`
            );
          });
        }
        // Add event listener for checkboxes
        $(".epic-checkbox").on("change", function () {
          $(this)
            .closest("label")
            .toggleClass("highlighted", $(this).is(":checked"));
        });
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  });
});

$("#backlog").change(function () {
  let backlogId = $(this).val();
  $.ajax({
    url: baseUrl + "meeting/epicByBacklog/" + backlogId,
    type: "POST",
    dataType: "json",
    success: function (data) {
      let epicSelect = $("#epic-checkbox");
      epicSelect.empty();
      epicSelect.append(
        '<option value="" disabled selected>Select the Epic</option>'
      );
      $.each(data, function (index, backlog) {
        epicSelect.append(`
                  <input type="checkbox" class="epic-checkbox"
                  value="${backlog.epic_id}" data-description="${backlog.epic_description}">${backlog.epic_description}<br>`);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
});

$(document).ready(function () {
  $("#meeting_type").on("change", function () {
    let typeId = $(this).val();
    if (typeId === "3") {
      $(
        "#recurrence_meeting_container,#sprint_start_date_container,#sprint_end_date_container"
      ).show();
      $(
        "#backlog-container,#epic-container,#userstory-container,#meeting_start_date_container,#meeting_end_date_container"
      ).hide();
    } else if (typeId === "2") {
      $(
        "#recurrence_meeting_container,#sprint_start_date_container,#sprint_end_date_container"
      ).hide();
      $(
        "#backlog-container,#epic-container,#userstory-container,#meeting_start_date_container,#meeting_end_date_container"
      ).show();
    } else {
      $(
        "#recurrence_meeting_container,#sprint_start_date_container,#sprint_end_date_container,#backlog-container,#epic-container,#userstory-container"
      ).hide();
      $("#meeting_start_date_container, #meeting_end_date_container").show();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  function updateUserStories() {
    var selectedEpics = $(".epic-checkbox:checked");
    var userstoryDropdown = $("#userstoryDropdown");

    userstoryDropdown.empty(); // Clear the dropdown

    if (selectedEpics.length > 0) {
      selectedEpics.each(function () {
        var epicId = $(this).val();
        $.ajax({
          url: baseUrl + "backlog/userstoryByEpic/" + epicId,
          method: "POST",
          success: function (response) {
            if (response.length > 0) {
              response.forEach(function (userstory) {
                userstoryDropdown.append(
                  `<label class="dropdown-item px-3"><input type="checkbox" class="userstory-checkbox" value="${
                    userstory.user_story_id
                  }" data-description="${
                    userstory.story_name
                  }" data-epic-id="${epicId}"> US_ ${
                    userstory.user_story_id + " : " + userstory.story_name
                  }</label>`
                );
              });
            } else {
              userstoryDropdown.append(
                `<label class="dropdown-item px-3 text-danger">No user stories available for this epic.</label>`
              );
            }
          },
          error: function () {
            userstoryDropdown.append(
              `<label class="dropdown-item px-3 text-danger">Failed to load user stories.</label>`
            );
          },
        });
      });
    } else {
      userstoryDropdown.append(
        `<label class="dropdown-item px-3 text-danger">Select an epic to see user stories.</label>`
      );
    }
  }

  function handleSelectAllUserStories() {
    $(document).on("change", "#selectAllUserStories", function () {
      var isChecked = $(this).is(":checked");
      $(".userstory-checkbox").prop("checked", isChecked).trigger("change");
    });
  }

  function handleCheckboxChange(checkboxClass, inputId) {
    $(document).on("change", checkboxClass, function () {
      var inputField = $(inputId);
      var hiddenInputField = $(inputId + "Hidden");

      var descriptions = [];
      var values = [];
      var selectedCount = 0; // Count selected checkboxes

      $(checkboxClass + ":checked").each(function () {
        descriptions.push($(this).data("description"));
        values.push($(this).val());
        selectedCount++; // Increment count
      });

      if (checkboxClass === ".userstory-checkbox") {
        inputField.val(`${selectedCount} : User stories selected`); // Show count in the input field
      } else {
        inputField.val(descriptions.join(", "));
      }

      hiddenInputField.val(values.join(","));

      if (this.checked) {
        $(this).closest("label").addClass("highlight");
      } else {
        $(this).closest("label").removeClass("highlight");
      }

      // Check or uncheck the "Select All" checkbox based on the selection of individual checkboxes
      const allChecked =
        $(checkboxClass).length === $(checkboxClass + ":checked").length;
      if (checkboxClass === ".userstory-checkbox") {
        $("#selectAllUserStories").prop("checked", allChecked);
      }

      if (checkboxClass === ".epic-checkbox") {
        updateUserStories();
      }
    });

    $(document).on("click", ".dropdown-item", function (e) {
      if (!$(e.target).is("input")) {
        $(this).find("input").trigger("click");
      }
    });
  }

  handleSelectAllUserStories();
  handleCheckboxChange(".epic-checkbox", "#epicdropdown");
  handleCheckboxChange(".userstory-checkbox", "#userstory");
  handleCheckboxChange(".team-checkbox", "#addgroup");
});

//to Fetch the user based on product
$(document).ready(function () {
  $("#product_div").change(function () {
    let productId = $(this).val();
    $.ajax({
      url: baseUrl + "meeting/getMembersByProduct/" + productId,
      type: "POST",
      dataType: "json",
      success: function (data) {
        let emailDropdown = $("#emailDropdown");
        emailDropdown.empty();
        $.each(data.members, function (index, member) {
          emailDropdown.append(
            `<label class='email-option' onclick="updateSelectedEmails('${member.first_name}')">${member.first_name}</label>`
          );
        });
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  });
});

function convertDateFormat(dateStr) {
  // Split the date string into components
  let parts = dateStr.split("-");
  let day = parts[0];
  let month = parts[1];
  let year = parts[2];

  // Array of month names
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Convert the month number to month name
  let monthName = monthNames[parseInt(month) - 1];

  // Construct the new date format
  return `${day}, ${monthName} ${year}`;
}
