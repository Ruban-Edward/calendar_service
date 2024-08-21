<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
// $routes->get('/', 'Home::index');
// $routes->get('/', 'MeetingController::calendar');
$routes->group('meeting', function ($routes) {
    $routes->get('calendar/', 'MeetingController::calendar');
    $routes->post('eventdetails/(:num)/(:num)', 'MeetingController::getMeetingDetails/$1/$2');
    $routes->post('sprintdetails/(:num)', 'MeetingController::getSprintDetails/$1');
    $routes->post('sprintByProduct/(:num)', 'MeetingController::sprintByProduct/$1');
    $routes->post('teamBySprint/(:num)', 'MeetingController::teamBySprint/$1');
    $routes->post('scheduleMeeting', 'MeetingController::meetingConfirmation');
    $routes->post('updateMeeting', 'MeetingController::meetingUpdation');
    $routes->post('cancelMeeting/(:num)', 'MeetingController::cancelMeetings/$1');
    $routes->post('logMeetingTimes', 'MeetingController::logMeetingTimes');
    $routes->post('mailFunction', 'MeetingController::sendMail');
    $routes->post('createGroupDetails', 'MeetingController::createGroup');
    $routes->post('editGroupDetails', 'MeetingController::editGroup');
    $routes->post('deleteGroupDetails', 'MeetingController::deleteGroup');
    $routes->post('getTeamDetailsById/(:num)', 'MeetingController::getTeamDetailsById/$1');
    $routes->post('getSprintDetails/(:num)', 'MeetingController::getSprintMembersDetails/$1');
    $routes->post('sprintInsert', 'MeetingController::sprintInsert');
    $routes->post('getMembersByProduct/(:num)', 'MeetingController::getMembersByProduct/$1');
    $routes->post('backlogByProduct/(:num)', 'MeetingController::backlogByProduct/$1');
    $routes->post('epicByBacklog/(:num)', 'MeetingController::getEpic/$1');
});
