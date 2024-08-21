<?php

/**
 * MeetingMemberModel.php
 *
 * @category   Model
 * @author     Ruban Edward
 * @created    14 July 2024
 * @purpose    To insert the meeting members in meeting_members table       
 */

namespace App\Models\Meeting;

use CodeIgniter\Model;

class MeetingMemberModel extends Model
{

    // Table name for insertion
    protected $table = "scrum_meeting_members";

    //setting the primary key to insert 
    protected $primaryKey = "meeting_members_id";

    // Defining the fields that are allowed to insert
    protected $allowedFields = [
        "r_meeting_details_id",
        "r_user_id",
    ];

    // Setting the validation rules for the model fields
    protected $validationRules = [
        "r_meeting_details_id" => "required|integer",
        "r_user_id" => "integer",

    ];

    // Setting custom validation messages for the fields
    protected $validationMessages = [
        "r_meeting_details_id" => [
            "required" => "The meeting details ID is required.",
            "integer" => "The meeting details ID must be an integer."
        ],
        "r_user_id" => [
            "integer" => "The meeting member ID must be an integer."
        ]
    ];

    /**
     * Retrieve the validation rules.
     * @return array
     */
    public function getDetailValidationRules(): array
    {
        return $this->validationRules;
    }

    /**
     * Retrieve the validation messages.
     * @return array
     */
    public function getValidationMessages(): array
    {
        return $this->validationMessages;
    }

    /**
     * Function to insert meeting members to the table
     * @param array $data
     * @return boolean
     */
    public function insertMeetingMembers($data): bool
    {
        //insert the meeting members with the meeting Id to the table
        $sql = "INSERT INTO scrum_meeting_members(
                    r_meeting_details_id, r_user_id
                    ) 
                VALUES 
                    (
                        :r_meeting_details_id:,:r_user_id:
                    )";
        $result = $this->db->query($sql, [
            'r_meeting_details_id' => $data['r_meeting_details_id'],
            'r_user_id' => $data['r_user_id'],
        ]);

        return $result; //returns the boolean value whether the query executed or not
    }


    /**
     * Function to insert meeting members to the table
     * @param array $data
     * @return boolean
     */
    public function updateMeetingMembers($data): bool
    {
        //update the meeting members with the meeting Id to the table
        $sql = "SELECT 
                    r_user_id 
                FROM 
                    scrum_meeting_members 
                WHERE 
                    r_user_id=:r_user_id:
                    AND r_meeting_details_id=:r_meeting_details_id:
                    AND is_deleted = :is_deleted:";
        $query = $this->query($sql, [
            'r_meeting_details_id' => $data['r_meeting_details_id'],
            'r_user_id' => $data['r_user_id'],
            'is_deleted' => 'N'
        ]);
        if ($query->getNumRows() > 0) {
            return 0; //returns the boolean value false if the user is already in the table
        } else {
            $sql = "INSERT INTO 
                    scrum_meeting_members 
                    (
                        r_meeting_details_id,
                        r_user_id
                    ) 
                VALUES 
                (
                    :r_meeting_details_id:,
                    :r_user_id:
                )";
            $query = $this->query($sql, [
                'r_meeting_details_id' => $data['r_meeting_details_id'],
                'r_user_id' => $data['r_user_id']
            ]);
            return 1; //returns the boolean value true if the query executed
        }
    }


    /**
     * Function to insert meeting members to the table
     * @param array $data
     * @return void
     */
    public function deletingExistingMembers($data): void
    {
        //removing the meeting members 
        $sql = "DELETE FROM 
                    scrum_meeting_members 
                WHERE 
                    r_meeting_details_id=:r_meeting_details_id: 
                    AND 
                    r_user_id=:r_user_id:";
        $query = $this->query($sql, [
            'r_meeting_details_id' => $data['r_meeting_details_id'],
            'r_user_id' => $data['r_user_id'],
        ]);
    }

    /**
     * Updates the meeting duration for an attendee.
     *
     * @author Rama Selvan
     * @param array $args An associative array containing:
     *                    - 'hours' (float): The duration of the meeting in hours.
     *                    - 'id' (int): The ID of the meeting member to update.
     * @return void
     */
    public function updateAttendeeHours($args): void
    {

        $sql = " UPDATE scrum_meeting_members SET meeting_members_duration = :meeting_members_duration: 
        where meeting_members_id = :meeting_members_id:";
        $query = $this->query($sql, [
            'meeting_members_duration' => $args['hours'],
            'meeting_members_id' => $args['id']
        ]);
    }

    /**
     * @author Hari Sankar R
     * Inserting newly added members in meeting avoiding existing members
     * @param array $data
     * @return array
     */
    public function getExistingMeetingMembers($data): array
    {
        $sql = "SELECT 
                    su.first_name 
                FROM 
                    scrum_meeting_members AS mm 
                INNER JOIN 
                    scrum_user AS su 
                    ON su.external_employee_id = mm.r_user_id 
                WHERE 
                    r_meeting_details_id = :meet_id:";
        $query = $this->query($sql, ['meet_id' => $data['meet_id']]);
        return $query->getResultArray(); //returns result as an array format
    }

    /**
     * To display the meeting members in the view meeeting Modal
     * @author Hari Sankar R
     * @param array $args
     * @return mixed
     */
    public function getMeetingMembersEdit($args): mixed
    {
        $sql = "SELECT  
                    su.first_name,
                    mm.meeting_members_id,
                    mm.r_user_id
                FROM 
                    scrum_meeting_members AS mm
                INNER JOIN
                    scrum_user AS su
                    ON su.external_employee_id = mm.r_user_id
                WHERE  
                    r_meeting_details_id = :meetId:
                AND 
                    mm.is_deleted = :is_deleted:";

        //using Bind Param for executing the query
        $query = $this->query($sql, [
            'meetId' => $args['meetId'],
            'is_deleted' => 'N'
        ]);
        if ($query->getNumRows() > 0) {
            return $query->getResultArray(); //returns result as an array format
        } else {
            return [];
        }
    }
}
