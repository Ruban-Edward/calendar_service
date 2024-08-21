<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?=ASSERT_PATH?>assets/css/meeting/calendar.css">
    <link rel="shortcut icon" href="<?=ASSERT_PATH?>support/compiled/svg/favicon.svg" type="image/x-icon">
    <link rel="stylesheet" href="<?=ASSERT_PATH?>support/compiled/css/app.css">
    <link rel="stylesheet" href="<?=ASSERT_PATH?>support/extensions/@fortawesome/fontawesome-free/css/all.min.css">
    <link rel="stylesheet" href="<?=ASSERT_PATH?>support/compiled/css/iconly.css">
    <link rel="stylesheet" href="<?=ASSERT_PATH?>support/compiled/css/styles.css">
    <link rel="stylesheet" href="<?=ASSERT_PATH?>support/extensions/sweetalert2/sweetalert2.css">
    <script src="<?=ASSERT_PATH?>support/extensions/sweetalert2/sweetalert2.js"></script>
    <link rel="stylesheet" href="<?=ASSERT_PATH?>support/compiled/css/tippy.css">
    <link rel="stylesheet" href="<?=ASSERT_PATH?>support/extensions/flatpickr/flatpickr.min.css">
    <script src="<?=ASSERT_PATH?>support/extensions/flatpickr/flatpickr.min.js"></script>
    <script src="<?=ASSERT_PATH?>assets/js/jquery.min.js"></script>
    <script src="<?=ASSERT_PATH?>support/compiled/js/commonJSHelper.js"></script>
    <!-- <script src="<?=ASSERT_PATH?>assets/js/bootstrap.min.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <title>Calendar</title>
</head>

<body>



    <?php
$sprintId = $data['sprintDetails'];
$id = [];
if (!empty($sprintId)) {
    foreach ($sprintId as $value) {
        $id['sprint_id'] = $value['sprint_id'];
    }
}
?>

    <!-- Calendar Display Section -->
    <div id='calendar' class="calendar"></div>

    <!-- Modal for Scheduling Meeting -->
    <div class="modal fade text-left" id="meetingModal" tabindex="-1" role="dialog" aria-labelledby="myMeetingModal"
        aria-hidden="true" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document" id="modal-size">
            <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">Schedule meeting</h5>
                    <button type="button" class="btn-close custom-close-btn" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body">

                    <!--Ram -->
                    <div id="timeLogSection" class="timeLogSection">
                        <div class="container">
                            <div class="row">
                                <!-- Left side: Meeting Details -->
                                <div class="col-md-6">
                                    <div class="meeting-details">
                                        <p><b>Meeting host</b><span>: </span> <span id="mHost"></span></p>
                                        <p><b>Meeting name</b><span>: </span><span id="mName"></span></p>
                                        <p><b>Meeting description</b><span>: </span> <span id="mDescription"></span></p>
                                        <p><b>Meeting date</b><span>: </span><span id="mDate"></span></p>
                                        <p><b>Meeting start time</b><span>: </span><span id="mstartTime"></span></p>
                                        <p><b>Meeting end time</b><span>: </span><span id="mendTime"></span></p>
                                        <p><b>Meeting duration</b><span>: </span> <span id="mDuration"></span></p>
                                        <p><b>Product:</b><span>: </span><span id="mProduct"></span></p>

                                    </div>
                                </div>

                                <!-- Right side: Attendees with input boxes -->
                                <div class="col-md-6">
                                    <p style=" color: #3949AB ;"><strong>Meeting Attendees</strong></p>


                                    <form class="row g-3 needs-validation" id="timeLogForm" method="POST" novalidate>
                                        <input type="hidden" id="meetingIdHiddenInput" name="meetingId">
                                        <input type="hidden" id="comments" name="comments">
                                        <input type="hidden" id="sdate" name="sdate">
                                        <input type="hidden" id="product" name="product">
                                        <input type="hidden" id="mtype" name="mtype">
                                        <input type="hidden" id="sprintId" name="sprintId">


                                        <div class="meeting-attendees scrollable" id="attendeesList">
                                            <!-- Attendees will be populated here dynamically -->
                                        </div>
                                        <button type="submit" id="timelogbutton" class="btn btn-primary me-1 mb-2">Log
                                            Time</button>
                                    </form>

                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- Form for Scheduling Meeting -->
                    <div id="scheduleMeetingForm">
                        <form class="row g-3 needs-validation" id="meetingForm" novalidate>

                            <!-- Hidden Field for Selected Emails -->
                            <input type="hidden" id="selectedEmailsInput" name="selectedEmails" value="">
                            <input type="hidden" id="meeting_details_id" name="meeting_id" value="">
                            <input type="hidden" id="formOperation" name="formOperation" value="insert">
                            <input type="hidden" id="recurranceId" name="recurranceId">


                            <!-- Form Field: Meeting Title -->
                            <div class="col-md-6">
                                <label for="meeting_title" class="form-label">Meeting title</label>
                                <input type="text" class="form-control" id="meeting_title" name="meeting_title"
                                    placeholder="Enter the meeting title" required>
                                <div class="invalid-feedback">Please provide a meeting title.</div>
                            </div>

                            <!-- Form Field: Product -->
                            <div class="col-md-6">
                                <label for="product_div" class="form-label">Product</label>
                                <select class="form-select" id="product_div" name="r_product_id" required>
                                    <option value="" disabled selected>Select the product</option>
                                    <?php foreach ($data['product'] as $value) {
    echo "<option value='{$value['external_project_id']}'>{$value['product_name']}</option>";
}?>
                                </select>
                                <div class="valid-feedback">Looks good!</div>
                                <div class="invalid-feedback">Please choose a product.</div>
                            </div>

                            <!-- Form Field: Meeting Type -->
                            <div class="col-md-6">
                                <label for="r_meeting_type_id" class="form-label">Meeting type</label>
                                <select class="form-select" id="meeting_type" name="r_meeting_type_id" required>
                                    <option value="" disabled selected>Select the meeting type</option>
                                    <?php foreach ($data['meetingType'] as $value) {
    echo "<option value='{$value['meeting_type_id']}'>{$value['meeting_type_name']}</option>";
}?>
                                </select>
                                <div class="valid-feedback">Looks good!</div>
                                <div class="invalid-feedback">Please choose a meeting type.</div>
                            </div>

                            <!-- Form Field: Backlog Items -->
                            <div class="col-md-6" id="backlog-container" style="display: none;">
                                <label for="r_backlog_item_id" class="form-label">Backlog item name</label>
                                <select class="form-select" id="backlog" name="r_backlog_item_id">
                                    <option value="" disabled selected>Select the backlog</option>
                                </select>
                                <div class="invalid-feedback">Please provide a brainstorming title</div>
                            </div>

                            <!-- Form Field: Epic Items -->
                            <div class="col-md-6" id="epic-container" style="display: none;">
                                <label for="epicdropdown" class="form-label">Epic item name</label>
                                <input type="text" class="form-control" id="epicdropdown" name="r_epic_id"
                                    data-bs-toggle="dropdown" aria-expanded="false" placeholder="Choose the epic"
                                    readonly>
                                <input type="hidden" id="epicHidden" name="epicHidden">
                                <ul class="dropdown-menu" aria-labelledby="epicdropdown">
                                    <div id="epic-checkbox-container"></div>
                                </ul>
                            </div>

                            <!-- Form Field: User Story Items -->
                            <div class="col-md-6" id="userstory-container" style="display: none;">
                                <label for="userstory" class="form-label">User stories</label>
                                <input type="text" class="form-control" id="userstory" name="r_user_story_id"
                                    data-bs-toggle="dropdown" aria-expanded="false" placeholder="Choose the userstory"
                                    readonly>
                                <input type="hidden" id="userstoryHidden" name="userstoryHidden">
                                <ul class="dropdown-menu" aria-labelledby="userstory">
                                    <li>
                                        <label class="dropdown-item px-3">
                                            <input type="checkbox" id="selectAllUserStories"> Select All
                                        </label>
                                    </li>
                                    <li id="userstoryDropdown"></li>
                                </ul>
                            </div>

                            <!-- Form Field: sprint Type -->
                            <div class="col-md-6" id="sprint_div" style="display: none;">
                                <label for="r_sprint_id" class="form-label">Sprint</label>
                                <select class="form-select" id="spId" name="r_sprint_id">
                                    <option value="" disabled selected>Select the sprint</option>
                                </select>
                            </div>

                            <!-- Form Field: Recurrence Count -->
                            <div class="col-md-6" id="recurrence_meeting_container" style="display: none;">
                                <label for="recurrence_meeting" id="labelok" class="form-label">Recurrence
                                    meeting</label>
                                <select class="form-select" id="recurrence_meeting" name="recurrance_meeting_id"
                                    required>
                                    <option value="" disabled selected>Select the recurrence</option>
                                    <option value="0">None</option>
                                    <option value="1">Daily</option>
                                    <option value="2">Every 2 Days</option>
                                    <option value="3">Every 3 Days</option>
                                    <option value="4">Every 4 Days</option>
                                    <option value="5">Every 5 Days</option>
                                    <option value="7">Every Week</option>
                                </select>
                                <div class="valid-feedback">Looks good!</div>
                                <div class="invalid-feedback">Please choose a recurrence.</div>
                            </div>
                            <input type="hidden" id="selected_recurrence" name="selected_recurrence" value="">

                            <!-- Form Field: Sprint Start Date -->
                            <div class="col-md-6" id="sprint_start_date_container" style="display: none;">
                                <label for="sprint_start_date" class="form-label">Recurrence start date</label>
                                <input type="text" class="form-control mb-3 flatpickr-no-config flatpickr-input"
                                    id="sprint_start_date" name="sprint_start_date" accept=""
                                    placeholder="Select recurrence start date" required>
                                <div class="invalid-feedback">Please choose a recurrence start date.</div>
                            </div>

                            <!-- Form Field: Sprint End Date -->
                            <div class="col-md-6" id="sprint_end_date_container" style="display: none;">
                                <label for="sprint_end_date" class="form-label">Recurrence end date</label>
                                <input type="text" class="form-control mb-3 flatpickr-no-config flatpickr-input"
                                    id="sprint_end_date" name="sprint_end_date" accept=""
                                    placeholder="Select recurrence end date" required>
                                <div class="invalid-feedback">Please choose a recurrence end date.</div>
                            </div>

                            <!-- Form Field: Meeting Duration -->
                            <div class="col-md-6">
                                <label for="meeting_duration" class="form-label"
                                    style="margin-right: 130px;">Hours</label>
                                <label for="meeting_duration" class="form-label">Minutes</label>
                                <div class="input-group">
                                    <input type="number" class="form-control" id="meeting_duration_hours"
                                        name="meeting_duration_hours" min="0" max="24" placeholder="" value="0">
                                    <input type="number" class="form-control" id="meeting_duration_minutes"
                                        name="meeting_duration_minutes" min="0" max="59" placeholder="00" required>
                                </div>
                            </div>

                            <!-- Form Field: Meeting Start Date -->
                            <div class="col-md-3" id="meeting_start_date_container">
                                <label for="meeting_start__date" class="form-label">Meeting start date</label>
                                <input type="text" class="form-control mb-3 flatpickr-no-config flatpickr-input"
                                    id="meeting_start_date" name="meeting_start_date" accept=""
                                    placeholder="Select date" required>
                                <div class="invalid-feedback">Please choose a meeting date.</div>
                            </div>

                            <!-- Form Field: Meeting Start Time -->
                            <div class="col-md-3">
                                <label for="meeting_start_time" class="form-label">Meeting start time</label>
                                <select class="form-select" id="startTimeSelect" name="meeting_start_time"
                                    required></select>
                                <div class="invalid-feedback">Please choose a meeting start time.</div>
                            </div>

                            <!-- Form Field: Meeting End Date -->
                            <div class="col-md-3" id="meeting_end_date_container">
                                <label for="meeting_end_date" class="form-label">Meeting end date</label>
                                <input type="text" class="form-control mb-3 flatpickr-no-config flatpickr-input"
                                    id="meeting_end_date" name="meeting_end_date" accept="" placeholder="Select date"
                                    required>
                                <div class="invalid-feedback">Please choose a meeting date.</div>
                            </div>

                            <!-- Form Field: Meeting End Time -->
                            <div class="col-md-3">
                                <label for="meeting_end_time" class="form-label">Meeting end time</label>
                                <select class="form-select" id="endTimeSelect" name="meeting_end_time"
                                    required></select>
                                <div class="invalid-feedback">Please choose a meeting end time.</div>
                            </div>

                            <!-- Form Field: Meeting Location -->
                            <div class="col-md-6">
                                <label for="r_meeting_location_id" class="form-label">Meeting location</label>
                                <select class="form-select" id="meeting_location" name="r_meeting_location_id" required>
                                    <option value="">Select the meeting location</option>
                                    <?php foreach ($data['meetingLocation'] as $value) {
    echo "<option value='{$value['meeting_location_id']}'>{$value['meeting_location_name']}</option>";
}?>
                                </select>
                                <div class="valid-feedback">Looks good!</div>
                                <div class="invalid-feedback">Please choose a meeting location.</div>
                            </div>

                            <!-- Form Field: Meeting Link -->
                            <div class="col-md-6">
                                <label for="meeting_link" class="form-label">Meeting link / place</label>
                                <input type="text" class="form-control" id="meeting_link" name="meeting_link"
                                    placeholder="Enter the meeting link" required>
                                <div class="valid-feedback">Looks good!</div>
                                <div class="invalid-feedback">Please provide a meeting link / Place</div>
                            </div>

                            <!-- Form Field: Meeting Description -->
                            <div class="col-md-6">
                                <label for="meeting_description" class="form-label">Meeting description</label>
                                <textarea type="text" class="form-control" id="meeting_description"
                                    name="meeting_description" placeholder="Enter the description"></textarea>
                                <div class="valid-feedback">Looks good!</div>
                                <div class="invalid-feedback">Please provide a meeting description.</div>
                            </div>


                            <!-- Form Field: Team Members -->
                            <div class="col-md-6">
                                <label for="meeting_team" class="form-label">
                                    <div class="btn-group" role="group" aria-label="Invite options">
                                        <button type="button" class="cls-add-members" onclick="showAddTeamMember()">Add
                                            team member</button>
                                        <button type="button" class="cls-add-members" onclick="showInviteGroup()">/
                                            Invite group</button>
                                    </div>
                                </label>
                                <div class="dropdown">
                                    <div id="addTeamMemberSection" style="display: none;">
                                        <div class="input-group mb-3">
                                            <span class="input-group-text"><i class="fas fa-search"></i></span>
                                            <input type="text" class="form-control" id="teamInput"
                                                placeholder="Search team members" onkeyup="filterEmails()"
                                                autocomplete="off">
                                        </div>
                                        <div id="emailDropdown" class="dropdown-menu">
                                        </div>
                                    </div>
                                    <div id="inviteGroupSection" style="display: none;">
                                        <input type="text" class="form-control" id="addgroup" name="addgroup"
                                            data-bs-toggle="dropdown" aria-expanded="false"
                                            placeholder="Choose the Group" readonly>
                                        <ul class="dropdown-menu" aria-labelledby="addgroup">
                                            <?php foreach ($data['groupName'] as $value): ?>
                                            <label class="dropdown-item px-3">
                                                <input type="checkbox" class="team-checkbox"
                                                    value="<?=trim(ucfirst(strtolower($value['meeting_team_id'])))?>"
                                                    data-description="<?=trim(ucfirst(strtolower($value['meeting_team_name'])))?>">
                                                <?=trim(ucfirst(strtolower($value['meeting_team_name'])))?>
                                            </label>
                                            <?php endforeach;?>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div id="selectedEmails" class="selected-emails"></div>
                            </div>

                            <!-- Add this inside your form, perhaps near the submit button -->
                            <div id="updateAsSeriesDiv" style="display: none;">
                                <div class="form-check" style="padding-left : 340px;">
                                    <input class="form-check-input" type="checkbox" id="updateAsSeries"
                                        name="updateAsSeries" value="1">
                                    <label class="form-check-label" for="updateAsSeries">
                                        Update as series
                                    </label>
                                </div>
                            </div>

                            <!-- Form Submit Button -->
                            <div class="modal-footer d-flex justify-content-center">
                                <button class="button" type="submit" name="Schedulebutton" id="Schedulebutton"
                                    value="submit">Schedule</button>
                            </div>
                        </form>
                    </div>

                    <!-- Event Details Section -->
                    <div id="eventDetails" class="eventDetails">
                        <div style="display: flex;">
                            <div class="col-md-6">
                                <p><b>Meeting title</b><span>:</span> <span id="eventTitle"></span></p>
                            </div>
                            <div class="col-md-6 view-details" id="viewDetails" style="display: none;"><a href=""></a>
                            </div>
                        </div>
                        <p><b>Meeting host</b><span>:</span> <span id="eventHost"></span></p>
                        <p><b>Product name</b><span>:</span> <span id="productName"></span></p>
                        <p><b>Sprint name</b><span>:</span> <span id="sprintName"></span></p>
                        <p><b>Meeting date</b><span>:</span> <span id="eventDate"></span></p>
                        <p><b>Meeting duration</b><span>:</span> <span id="eventduration"></span></p>
                        <p><b>Meeting time</b><span>:</span> <span id="eventStart"></span></p>
                        <p id="peventdesc"><b>Meeting description</b><span>:</span> <span id="eventdesc"></span></pD>
                        <p id="pmeetingLink"><b>Meeting link</b><span>:</span> <a id="meetingLink" href=""><span
                                    id="eventDescription"></span></a></p>
                        <p id="peventMembers"><b>Meeting members</b><span>:</span> <span id="eventMembers"></span></p>
                        <p id="pcancel"><b>Cancelled reason</b><span>:</span> <span id="cancel"></span></p>
                        <button class="btn btn-primary me-1 mb-2" name="editMeeetingButton" id="editMeetingButton"
                            style="display: none;">Edit meeting</button>
                        <button class="btn btn-danger me-1 mb-2" id="cancelMeetingButton" style="display: none;">Cancel
                            meeting</button>
                    </div>

                    <!-- Help Details Section -->
                    <div id="helpdetails" class="helpdetails">
                        <h6>Schedule meeting:</h6>
                        <p>Choose a date from the calendar to schedule our meetings.</p>
                        <h6>Status dropdown colours:</h6>
                        <p>Explaining the meaning of each status and their associated colours.</p>
                        <b class="cls-types">For meetings:</b>
                        <div>
                            <span class="badge col-md-2" style="background-color: #d85733;"><b>Ongoing</b></span> This
                            colour
                            indicates
                            ongoing meetings.
                            <br>
                            <span class="badge col-md-2" style="background-color: #63a4ff;"><b>Upcoming</b></span> This
                            colour
                            indicates
                            upcoming meetings.
                            <br>
                            <span class="badge col-md-2" style="background-color: #34be34;"><b>Completed</b></span> This
                            colour
                            indicates completed meetings.
                            <br>
                            <span class="badge col-md-2" style="background-color: #585858;"><b>Cancelled</b></span> This
                            colour
                            indicates cancelled meetings.
                            <br>
                            <span class="badge col-md-2" style="background-color: #fc1f1f;"><b>Need to log</b></span>
                            This colour
                            indicates to Log the meeting duration for attendees.
                        </div>
                        <br>
                        <b class="cls-types">For sprints:</b>
                        <div>
                            <span class="badge col-md-2" style="background-color: #d85733;"><b>Ongoing</b></span> This
                            colour
                            indicates
                            ongoing sprints.
                            <br>
                            <span class="badge col-md-2" style="background-color: #63a4ff;"><b>Upcoming</b></span> This
                            colour
                            indicates
                            upcoming sprints.
                            <br>
                            <span class="badge col-md-2" style="background-color: #F77B00;"><b>On hold</b></span> This
                            colour
                            indicates
                            on hold sprints.
                            <br>
                            <span class="badge col-md-2" style="background-color: #34be34;"><b>Completed</b></span> This
                            colour
                            indicates completed sprints.
                        </div>
                    </div>

                    <div id="groupdetails">
                        <form class="row g-3 needs-validation" id="groupForm" method="POST" novalidate>
                            <input type="hidden" name="groupId" id="groupId"
                                value="<?=isset($data['groupId']) ? $data['groupId'] : ''?>">
                            <div class="col-md-6" id="productDetails"></div>
                            <div class="col-md-6" id="showDetails"></div>
                            <div class="col-md-6" id="editGroup"></div>
                            <div class="col-md-12" id="memberDetails">
                                <label class="form-label">Add members</label>
                                <div class="input-group mb-3">
                                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                                    <input type="text" class="form-control" id="memberSearch"
                                        placeholder="Search members...">
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="cls-membersth"><input type="checkbox" id="selectAllMembers">
                                                    Select all</th>
                                                <th class="cls-membersth">User name</th>
                                            </tr>
                                        </thead>
                                        <tbody id="memberTableBody">
                                        </tbody>
                                    </table>
                                    <div id="paginationControls" class="d-flex justify-content-end align-items-center">
                                    </div>
                                </div>
                            </div>
                            <!-- Hidden input to hold the selected members -->
                            <input type="hidden" id="groupProductId" name="r_product_id" value="">
                            <input type="hidden" id="groupIdByName" name="meeting_team_id" value="">
                            <input type="hidden" name="selectedMembers" id="selectedMembers">
                            <input type="hidden" id="groupData" value='<?=json_encode($data['groupName']);?>'>
                            <input type="hidden" id="productData" value='<?=json_encode($data['product']);?>'>

                            <div class="modal-footer">
                                <button class="btn btn-primary me-1 mb-2" type="submit" name="groupbutton"
                                    id="groupbutton" value="submit">Create group</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!--sprint Modal -->
    <div class="modal" id="sprintModal" tabindex="-1" aria-labelledby="sprintModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="sprintModalLabel">Sprint Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modalBody">
                    <div id="sprintDetails" class="sprintDetails mb-4">
                        <p><b>Sprint Name</b> <span>:</span> <span id="sprintNames"></span></p>
                        <p><b>Sprint Creator</b> <span>:</span> <span id="sprintCreator"></span></p>
                        <p><b>Product Name</b> <span>:</span> <span id="sprintProduct"></span></p>
                        <p><b>Customer</b> <span>:</span> <span id="sprintCustomer"></span></p>
                        <p><b>Duration</b> <span>:</span> <span id="sprintDuration"></span></p>
                        <p><b>Start Date</b> <span>:</span> <span id="startDate"></span></p>
                        <p><b>End Date</b> <span>:</span> <span id="endDate"></span></p>
                        <p><b>Sprint Status</b> <span>:</span> <span id="sprintStatus"></span></p>
                    </div>
                    <div class="button-container" id="orgButton">
                        <button type="button" class="btn btn-primary" id="changeStatusBtn">
                            <i class="bi bi-check-square"></i> Change Status
                        </button>
                        <a href="" id="viewDetailsLink">
                            <button type="button" class="btn btn-primary" id="viewDetailsBtn">
                                <i class="bi bi-eye"></i> View Details
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Including FullCalendar Library -->
    <script src='<?=ASSERT_PATH?>assets/fullcalendar/dist/index.global.min.js'></script>

    <script>
    // JavaScript variables for meeting details and base URL
    var meetingDetails = <?=json_encode($data['showMeeting'])?>;
    var productList = <?=json_encode($data['product'])?>;
    var sprintDetails = <?=json_encode($data['sprintDetails'])?>;
    var meetType = <?=json_encode($data['meetingType'])?>;
    var duration = <?=json_encode($data['sprintDuration'])?>;
    var sprintStatus = <?=json_encode($data['sprintStatus'])?>;
    var sessionId = 36;
    var baseUrl = '<?=base_url()?>';
    </script>

    <script src='<?=ASSERT_PATH?>assets/js/meeting/calendar.js'></script>
</body>

</html>