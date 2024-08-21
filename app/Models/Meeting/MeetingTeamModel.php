<?php

/**
 * MeetingTeamModel.php
 *
 * @category   Model
 * @author     Hari Sankar R
 * @created   
 * @purpose    To insert the team details into scrum_meeting_team table       
 */

namespace App\Models\Meeting;

use CodeIgniter\Model;

class MeetingTeamModel extends Model
{
    // Table name for insertion
    protected $table = "scrum_meeting_team";

    //setting the primary key to insert 
    protected $primaryKey = "meeting_team_id";

    // Defining the fields that are allowed to insert
    protected $allowedFields = [
        "meeting_team_id",
        "meeting_team_name",
        "r_product_id",
        "r_external_employee_id",
        "created_date",
        "updated_date",
        "is_deleted"
    ];
    protected $validationRules = [
        'meeting_team_id' => 'permit_empty|integer',
        'meeting_team_name' => 'required|min_length[3]|max_length[255]',
        'r_product_id' => 'required|integer',
        'r_external_employee_id' => 'required|integer',
        'created_date' => 'permit_empty|regex_match[/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/]', // YYYY-MM-DD HH:MM:SS format
        'updated_date' => 'permit_empty|regex_match[/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/]'
    ];

    // Setting custom validation messages for the fields
    protected $validationMessages = [
        "meeting_team_name" => [
            "required" => "The meeting team is required.",
            "min_length" => "The meeting team must be at least 3 characters long.",
            "max_length" => "The meeting team cannot exceed 255 characters."
        ],
        "r_external_employee_id" => [
            "required" => "The Employee ID is required.",
            "integer" => "The Employee ID must be an integer."
        ],
        "created_date" => [
            "valid_date" => "The created date must be in the format Y-m-d H:i:s."
        ],
        "r_product_id" => [
            "required" => "The product ID is required.",
            "integer" => "The Product ID must be an integer."
        ],
        "updated_date" => [
            "valid_date" => "The created date must be in the format Y-m-d H:i:s."
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

    public function createGroup($data)
    {
        $sql = "INSERT INTO scrum_meeting_team (
                    meeting_team_name, r_product_id,
                    r_external_employee_id, created_date
                ) 
                VALUES 
                (
                    :meeting_team_name:,
                    :r_product_id:,
                    :r_external_employee_id:, 
                    NOW()
                )";
        $result = $this->query($sql, [
            'meeting_team_name' => $data['meeting_team_name'],
            'r_product_id' => $data['r_product_id'],
            'r_external_employee_id' => $data['r_external_employee_id']
        ]);
        if ($result) {
            return $this->db->insertID();
        } else {
            return false;
        }
    }
    public function editTeamDetails($data)
    {
        $sql = "UPDATE 
                scrum_meeting_team
            SET
                meeting_team_name=:meeting_team_name:,
                r_product_id=:r_product_id:,
                updated_date=NOW()
            WHERE 
                meeting_team_id=:meeting_team_id:
        ";
        $result = $this->query($sql, [
            'meeting_team_name' => $data['meeting_team_name'],
            'meeting_team_id' => $data['meeting_team_id'],
            'r_product_id' => $data['r_product_id']
        ]);
    }

    /**
     * @author Hari shankar R
     * @param int $id
     * @return bool
     * delete the group details based on Id
     */
    public function deleteGroupDetails($data)
    {
        $sql = "DELETE FROM 
                    scrum_meeting_team 
                WHERE 
                    meeting_team_id=:meeting_team_id:";
        $result = $this->query($sql, [
            'meeting_team_id' => $data['team_id'],
        ]);
        return $result;
    }

    /**
     * @author Gokul B
     * @param int $id
     * @return array
     * Retrieves team members against user and displaying brainstrom model
     */
    public function getTeamMembers($id)
    {
        $sql = "SELECT 
                    t.meeting_team_id,
                    t.meeting_team_name
                FROM 
                    scrum_meeting_team AS t
                WHERE
                    t.r_external_employee_id = :employee_id:
                    AND t.is_deleted = :is_deleted:";
        $query = $this->query($sql, [
            "employee_id" => $id,
            "is_deleted" => "N"
        ]);
        return $query->getResultArray();
    }
}
