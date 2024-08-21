<?php

/**
 * MeetingTeamMemberModel.php
 *
 * @category   Model
 * @author     Hari Sankar R
 * @created   
 * @purpose    To insert the team members details into scrum_meeting_team_memebers table       
 */

namespace App\Models\Meeting;

use CodeIgniter\Model;

class MeetingTeamMemberModel extends Model
{
    // Table name for insertion
    protected $table = "scrum_meeting_team_members";

    //setting the primary key to insert 
    protected $primaryKey = "meeting_team_member_id";

    // Defining the fields that are allowed to insert
    protected $allowedFields = [
        "r_meeting_team_id",
        "r_external_employee_id",
        "is_deleted"
    ];

    protected $validationRules = [
        'r_meeting_team_id' => 'required|integer',
        'r_external_employee_id' => 'required|integer'
    ];

    protected $validationMessages = [
        "r_meeting_team_id" => [
            "required" => "The Meeting team ID is required.",
            "integer" => "The Meeting team ID must be an integer."
        ],
        "r_external_employee_id" => [
            "required" => "The Employee ID is required.",
            "integer" => "The Employee ID must be an integer."
        ]
    ];

    public function getDetailValidationRules(): array
    {
        return $this->validationRules;
    }

    public function getValidationMessages(): array
    {
        return $this->validationMessages;
    }

    public function insertGroupMembers($data)
    {
        $sql = "INSERT INTO scrum_meeting_team_members (
                    r_meeting_team_id, 
                    r_external_employee_id
                ) 
                VALUES(
                    :r_meeting_team_id:,
                    :r_external_employee_id:
                )
                ";
        $result = $this->query($sql, [
            'r_meeting_team_id' => $data['r_meeting_team_id'],
            'r_external_employee_id' => $data['r_external_employee_id']
        ]);
        if ($result) {
            return 1;
        } else {
            return 0;
        }
    }
    public function editGroupMembers($data)
    {
        $sql = "SELECT 
                    r_meeting_team_id,r_external_employee_id
                FROM 
                    scrum_meeting_team_members 
                WHERE
                    r_external_employee_id=:r_external_employee_id:
                AND
                    r_meeting_team_id=:r_meeting_team_id:
        ";
        $result = $this->query($sql, [
            'r_meeting_team_id' => $data['r_meeting_team_id'],
            'r_external_employee_id' => $data['r_external_employee_id']
        ]);
        if ($result->getNumRows() > 0) {
            return 0;
        } else {
            $sql = "INSERT INTO 
                    scrum_meeting_team_members 
                    (
                        r_meeting_team_id,
                        r_external_employee_id
                    ) 
                    VALUES(
                    :r_meeting_team_id:,
                    :r_external_employee_id:
                )";
            $query = $this->query($sql, [
                'r_meeting_team_id' => $data['r_meeting_team_id'],
                'r_external_employee_id' => $data['r_external_employee_id']
            ]);
            return 1;
        }
    }

    /**
     * @author Hari shankar R
     * @param array $data
     * @return bool
     * Delete user from team group based on meetTeam and external employee Id
     */
    public function deletingGroupMembers($data): bool
    {
        $sql = "DELETE FROM 
                scrum_meeting_team_members
            WHERE
                r_meeting_team_id=:r_meeting_team_id:
            AND
                r_external_employee_id=:r_external_employee_id:
        ";
        $result = $this->query($sql, [
            'r_meeting_team_id' => $data['r_meeting_team_id'],
            'r_external_employee_id' => $data['r_external_employee_id'],
        ]);
        return $result;
    }

    /**
     * @author Hari shankar R
     * @param array $data
     * @return array
     * Retrieves the users from the group while that users can deleted or not.
     */
    public function getExistingGroupMembers($data): array
    {
        $sql = "SELECT 
                    r_external_employee_id
                FROM
                    scrum_meeting_team_members
                WHERE
                    r_meeting_team_id=:r_meeting_team_id:";
        $result = $this->query($sql, ['r_meeting_team_id' => $data['r_meeting_team_id']]);
        if ($result) {
            return $result->getResultArray();
        }
        return [];
    }

    /**
     * @author Hari shankar R
     * @param int $id
     * @return array
     * Delete the group members against on team Id
     */
    public function deleteGroupMembersDetails($data)
    {
        $sql = "DELETE FROM
                    scrum_meeting_team_members 
                WHERE 
                    r_meeting_team_id=:r_meeting_team_id:";
        $result = $this->query($sql, [
            'r_meeting_team_id' => $data['team_id'],
        ]);
        return $result;
    }
}
