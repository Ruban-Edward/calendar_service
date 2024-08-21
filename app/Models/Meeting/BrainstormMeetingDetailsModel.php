<?php

/**
 * BrainstormMeetingDetailsModel.php
 *
 * @category   Model
 * @author     Ruban Edward
 * @created    14 July 2024
 * @purpose    To insert the brainstorm meeting details in table       
 */

namespace App\Models\Meeting;

use CodeIgniter\Model;

class BrainstormMeetingDetailsModel extends Model
{
    protected $table = "scrum_brainstorm_meeting_details";

    protected $primaryKey = "brainstorm_meeting_id";

    protected $allowedFields = [
        "r_meeting_details_id",
        "r_backlog_item_id",
        "r_epic_id",
        "r_user_story_id"
    ];

    protected $validationRules = [
        'r_meeting_details_id' => 'required|integer',
        'r_backlog_item_id' => 'required|integer',
        'r_epic_id' => 'required|integer',
        'r_user_story_id' => 'required|integer'
    ];

    protected $validationMessages = [
        'r_meeting_details_id' => [
            'required' => 'The meeting details ID is required.',
            'integer'  => 'The meeting details ID must be an integer.'
        ],
        'r_backlog_item_id' => [
            'required' => 'The backlog item ID is required.',
            'integer'  => 'The backlog item ID must be an integer.'
        ],
        'r_epic_id' => [
            'required' => 'The epic ID is required.',
            'integer'  => 'The epic ID must be an integer.'
        ],
        'r_user_story_id' => [
            'required' => 'The user story ID is required.',
            'integer'  => 'The user story ID must be an integer.'
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
     * Insert the brainstrom meeting members to the table
     * @author Ruban Edward
     * @param array $data
     * @return void
     */
    public function insertBrainstormDetails($data){
        $sql = "INSERT INTO scrum_brainstorm_meeting_details(
                    r_meeting_details_id, r_backlog_item_id, 
                    r_epic_id, r_user_story_id
                    ) 
                VALUES 
                    (
                        :r_meeting_details_id:,:r_backlog_item_id:, 
                        :r_epic_id:,:r_user_story_id:
                    )";

        $query = $this->db->query($sql, [
            "r_meeting_details_id"=> $data["r_meeting_details_id"],
            "r_backlog_item_id"=> $data["r_backlog_item_id"],
            "r_epic_id"=> $data["r_epic_id"],
            "r_user_story_id"=> $data["r_user_story_id"],
        ]);
    }

    //ram

    // Getting the backlog id  
    public function getBacklogId($meetingId)
    {
        $sql = "SELECT DISTINCT md.external_issue_id
                FROM scrum_meeting_details md
                JOIN scrum_brainstorm_meeting_details bmd1 ON md.meeting_details_id = bmd1.r_meeting_details_id
                JOIN scrum_brainstorm_meeting_details bmd2 ON bmd1.r_backlog_item_id = bmd2.r_backlog_item_id
                WHERE bmd2.r_meeting_details_id =:r_meeting_details_id:
                AND md.r_meeting_type_id = 2
                AND md.external_issue_id IS NOT NULL
                LIMIT 1";
        
        $query = $this->db->query($sql, ['r_meeting_details_id'=> $meetingId["meeting_details_id"]]);

    
        if ($query->getNumRows() > 0) {
            $row = $query->getRow();
            return $row->external_issue_id;
        } else {
                return null;
        }
    }
}
