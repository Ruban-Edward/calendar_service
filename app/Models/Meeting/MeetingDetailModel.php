<?php

/**
 * MeetingDetailModel.php
 *
 * @category   Model
 * @author     Ruban Edward
 * @created    14 July 2024
 * @purpose    To insert the meeting details in meeting_details table       
 */

namespace App\Models\Meeting;

use CodeIgniter\Model;

class MeetingDetailModel extends Model
{
    // Table name for insertion
    protected $table = "scrum_meeting_details";

    //setting the primary key to insert 
    protected $primaryKey = "meeting_details_id";

    // Defining the fields that are allowed to insert
    protected $allowedFields = [
        "meeting_title",
        "r_meeting_type_id",
        "r_user_id",
        "r_product_id",
        "r_sprint_id",
        "external_issues_id",
        "r_meeting_location_id",
        "meeting_description",
        "meeting_start_date",
        "meeting_start_time",
        "meeting_end_date",
        "meeting_end_time",
        "meeting_duration",
        "meeting_link",
        "r_user_id_created",
        "created_date",
        "r_user_id_updated",
        "updated_date",
        "external_issue_id",
        "recurrance_meeting_id"
    ];

    // Setting the validation rules for the model fields
    protected $validationRules = [
        'meeting_title' => 'required|min_length[3]|max_length[255]',
        'r_meeting_type_id' => 'required|integer',
        'r_user_id' => 'required|integer',
        'r_product_id' => 'required|integer',
        'r_sprint_id' => 'permit_empty|integer',
        'external_issues_id' => 'permit_empty|integer',
        'r_meeting_location_id' => 'required|integer',
        'meeting_description' => 'permit_empty',
        'meeting_start_date' => 'required|regex_match[/^\d{4}-\d{2}-\d{2}$/]', // YYYY-MM-DD format
        'meeting_start_time' => 'required|regex_match[/^\d{2}:\d{2}:\d{2}$/]', // HH:MM:SS format
        'meeting_end_date' => 'required|regex_match[/^\d{4}-\d{2}-\d{2}$/]', // YYYY-MM-DD format
        'meeting_end_time' => 'required|regex_match[/^\d{2}:\d{2}:\d{2}$/]', // HH:MM:SS format
        'meeting_duration' => 'required|regex_match[/^\d{2}:\d{2}:\d{2}$/]', // HH:MM:SS format
        'meeting_link' => 'required',
        'r_user_id_created' => 'permit_empty|integer',
        'created_date' => 'permit_empty|regex_match[/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/]', // YYYY-MM-DD HH:MM:SS format
        'r_user_id_updated' => 'permit_empty|integer',
        'updated_date' => 'permit_empty|regex_match[/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/]',
        'external_issue_id' => 'permit_empty|integer',
        'recurrance_meeting_id' => 'permit_empty'
    ];

    // Setting custom validation messages for the fields
    protected $validationMessages = [
        "meeting_title" => [
            "required" => "The meeting title is required.",
            "min_length" => "The meeting title must be at least 3 characters long.",
            "max_length" => "The meeting title cannot exceed 255 characters."
        ],
        "r_meeting_type_id" => [
            "required" => "The meeting type is required.",
            "integer" => "The meeting type ID must be an integer."
        ],
        "r_user_id" => [
            "required" => "The user ID is required.",
            "integer" => "The user ID must be an integer."
        ],
        "r_product_id" => [
            "required" => "The product ID is required.",
            "integer" => "The product ID must be an integer."
        ],
        "r_sprint_id" => [
            "integer" => "The user ID must be an integer."
        ],
        "external_issues_id" => [
            "integer" => "The user ID must be an integer."
        ],
        "r_meeting_location_id" => [
            "required" => "The meeting location ID is required.",
            "integer" => "The meeting location ID must be an integer."
        ],
        "meeting_start_date" => [
            "required" => "The meeting start date is required.",
            "valid_date" => "The meeting date must be in the format Y-m-d."
        ],
        "meeting_start_time" => [
            "required" => "The meeting start time is required.",
            "valid_date" => "The meeting start time must be in the format H:i:s."
        ],
        "meeting_end_date" => [
            "required" => "The meeting end date is required.",
            "valid_date" => "The meeting date must be in the format Y-m-d."
        ],
        "meeting_end_time" => [
            "required" => "The meeting end time is required.",
            "valid_date" => "The meeting end time must be in the format H:i:s."
        ],
        "meeting_duration" => [
            "required" => "The meeting duration is required.",
            "integer" => "The meeting duration must be an integer."
        ],
        "meeting_link" => [
            "permit_empty" => "The meeting link is optional.",
            "valid_url" => "The meeting link must be a valid URL."
        ],
        "r_user_id_created" => [
            "integer" => "The user ID who created the meeting must be an integer."
        ],
        "created_date" => [
            "valid_date" => "The created date must be in the format Y-m-d H:i:s."
        ],
        "r_user_id_updated" => [
            "integer" => "The user ID who created the meeting must be an integer."
        ],
        "updated_date" => [
            "valid_date" => "The created date must be in the format Y-m-d H:i:s."
        ],
        "external_issue_id" => [
            "integer" => "The user ID who created the meeting must be an integer."
        ],
        "recurrance_meeting_id" => [
            "permit_empty" => "The recurrence meeting ID is optional."
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
     * Insert the meeting members to the table
     * @author Hari Sankar
     * @param array $data
     * @return integer
     */
    public function insertMeetingDetails($data): int
    {
        //insert the meeting details to the table
        $sql = "INSERT INTO scrum_meeting_details (
                    meeting_title, r_meeting_type_id, 
                    r_user_id, r_product_id,r_sprint_id, r_meeting_location_id, 
                    meeting_description, meeting_start_date, 
                    meeting_start_time, meeting_end_date, 
                    meeting_end_time, meeting_duration, 
                    meeting_link, r_user_id_created, created_date,
                    recurrance_meeting_id
                    ) 
                VALUES 
                    (
                        :meeting_title:, :r_meeting_type_id:, 
                        :r_user_id:, :r_product_id:, :r_sprint_id:,
                        :r_meeting_location_id:, :meeting_description:, 
                        :meeting_start_date:, :meeting_start_time:, 
                        :meeting_end_date:, :meeting_end_time:, 
                        :meeting_duration:, :meeting_link:, 
                        :r_user_id_created:, :created_date:,
                       :recurrance_meeting_id:
                    )";

        //Used Bind Param to execute the query
        $result = $this->db->query($sql, [
            'meeting_title' => $data['meeting_title'],
            'r_meeting_type_id' => $data['r_meeting_type_id'],
            'r_user_id' => $data['r_user_id'],
            'r_product_id' => $data['r_product_id'],
            'r_sprint_id' => $data['r_sprint_id'],
            'r_meeting_location_id' => $data['r_meeting_location_id'],
            'meeting_description' => $data['meeting_description'],
            'meeting_start_date' => $data['meeting_start_date'],
            'meeting_start_time' => $data['meeting_start_time'],
            'meeting_end_date' => $data['meeting_end_date'],
            'meeting_end_time' => $data['meeting_end_time'],
            'meeting_duration' => $data['meeting_duration'],
            'meeting_link' => $data['meeting_link'],
            'r_user_id_created' => $data['r_user_id_created'],
            'created_date' => $data['created_date'],
            'recurrance_meeting_id' => $data['recurrance_meeting_id'] ?? null

        ]);
        if ($result) {
            return $this->db->insertID();
        } else {
            return false;
        }
    }

    /**
     * Update the meeting members to the table
     * @author Hari Sankar
     * @param array $data
     * @return boolean
     */
    public function UpdateMeetingDetails($data): bool
    {
        $updateClause = "
            meeting_title = :meeting_title:,
            r_meeting_type_id = :r_meeting_type_id:,
            r_user_id = :r_user_id:,
            r_product_id = :r_product_id:,
            r_sprint_id = :r_sprint_id:,
            r_meeting_location_id = :r_meeting_location_id:,
            meeting_description = :meeting_description:,
            meeting_start_time = :meeting_start_time:,
            meeting_end_time = :meeting_end_time:,
            meeting_duration = :meeting_duration:,
            meeting_link = :meeting_link:,
            r_user_id_updated = :r_user_id_updated:,
            updated_date = :updated_date:
        ";

        $bindParams = [
            'meeting_title' => $data['meeting_title'],
            'r_meeting_type_id' => $data['r_meeting_type_id'],
            'r_user_id' => $data['r_user_id'],
            'r_product_id' => $data['r_product_id'],
            'r_sprint_id' => $data['r_sprint_id'],
            'r_meeting_location_id' => $data['r_meeting_location_id'],
            'meeting_description' => $data['meeting_description'],
            'meeting_start_time' => $data['meeting_start_time'],
            'meeting_end_time' => $data['meeting_end_time'],
            'meeting_duration' => $data['meeting_duration'],
            'meeting_link' => $data['meeting_link'],
            'r_user_id_updated' => $data['r_user_id_updated'],
            'updated_date' => $data['updated_date']
        ];

        if ($data['update_as_series'] && $data['recurrance_meeting_id']) {
            $sql = "UPDATE scrum_meeting_details SET $updateClause WHERE recurrance_meeting_id = :recurrance_meeting_id:";
            $bindParams['recurrance_meeting_id'] = $data['recurrance_meeting_id'];
        } else {
            $sql = "UPDATE scrum_meeting_details SET $updateClause, 
                    meeting_start_date = :meeting_start_date:, 
                    meeting_end_date = :meeting_end_date: 
                    WHERE meeting_details_id = :meeting_id:";
            $bindParams['meeting_start_date'] = $data['meeting_start_date'];
            $bindParams['meeting_end_date'] = $data['meeting_end_date'];
            $bindParams['meeting_id'] = $data['meeting_id'];
        }

        $result = $this->db->query($sql, $bindParams);
        return $result;
    }

    /**
     * Updates the external issue ID for a specific meeting detail.
     *
     *  @author Rama Selvan
     * @param array $data An associative array containing:
     *                    - 'external_issue_id' (int): The new external issue ID.
     *                    - 'meeting_details_id' (int): The ID of the meeting details to update.
     * @return \CodeIgniter\Database\ResultInterface The result of the query execution.
     */
    public function updateMeetingDetailsExternal($data)
    {
        $sql = "UPDATE scrum_meeting_details 
            SET external_issue_id = :external_issue_id: 
            WHERE meeting_details_id = :meeting_details_id:";

        $result = $this->db->query($sql, [
            'external_issue_id' => $data['external_issue_id'],
            'meeting_details_id' => $data['meeting_details_id']
        ]);

        return $result;
    }

    /**
     * Marks the meeting detail as logged.
     *
     *  @author Rama Selvan
     * @param array $data An associative array containing:
     *                    - 'meeting_details_id' (int): The ID of the meeting details to update.
     * @return \CodeIgniter\Database\ResultInterface The result of the query execution.
     *
     */
    public function timeLogisLogged($data)
    {
        $sql = " UPDATE scrum_meeting_details SET is_logged =:is_logged: WHERE meeting_details_id =:meeting_details_id:";
        $result = $this->db->query($sql, [
            'is_logged' => "Y",
            'meeting_details_id' => $data['meeting_details_id']
        ]);
        return $result;
    }

    /**
     * Retrieves the details of a specific meeting.
     *
     *  @author Rama Selvan
     * @param int $meetingId The ID of the meeting to retrieve details for.
     * @return array|null The meeting details as an associative array, or null if not found.
     */
    public function getMeetingDetails($meetingId)
    {
        $query = $this->db->query("SELECT * FROM {$this->table} WHERE meeting_details_id = ?", [$meetingId]);
        return $query->getRowArray();
    }

    /**
     * Updates the external issue ID for a specific meeting detail using direct query.
     * 
     * @author Rama Selvan
     * @param int $meetingId The ID of the meeting details to update.
     * @param int $taskId The new external issue ID.
     * @return \CodeIgniter\Database\ResultInterface The result of the query execution.
     */
    public function updateExternalReferenceTaskId($meetingId, $taskId)
    {

        $sql = "UPDATE scrum_meeting_details SET external_issue_id = $taskId WHERE meeting_details_id = $meetingId ";
        $result = $this->db->query($sql);
        return $result;
    }

    /**
     * @author Ruban Edward R
     * @return array
     * Retrieves and prepares data for displaying the meeting calendar view and sprint view
     */
    public function showMeetings($name): array
    {
        //query to fetch the specific meeting details
        $sql = "SELECT 
            md.meeting_details_id, 
            mt.meeting_type_name,
            md.r_meeting_type_id, 
            md.meeting_start_date, 
            md.meeting_start_time,
            md.meeting_end_date,  
            md.meeting_end_time,
            md.is_deleted,
            md.is_logged
        FROM 
            scrum_meeting_details as md 
        INNER JOIN scrum_meeting_type as mt 
            ON md.r_meeting_type_id = mt.meeting_type_id 
        INNER JOIN scrum_meeting_members AS mm
            ON mm.r_meeting_details_id = md.meeting_details_id
        WHERE 
            mm.r_user_id = :user_name:
            AND md.meeting_start_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)";

        //using Bind Param for executing the query
        $result = $this->query($sql, [
            'user_name' => $name
        ]);
        return $result->getResultArray(); //returns result as an array format
    }

    /**
     * Updated the meeting Details for cancel reason and soft deleteing the meeting
     * @author Hari Sankar R
     * @param array $args
     * @return void
     */
    public function CancelMeetingsReason($args): void
    {
        $sql = 'UPDATE 
                    scrum_meeting_details 
                SET 
                    cancel_reason = :cancel_reason:, 
                    is_deleted = :is_deleted: 
                WHERE 
                    meeting_details_id = :meeting_details_id:';

        $query = $this->query($sql, [
            'cancel_reason' => $args['reason'],
            'meeting_details_id' => $args['id'],
            'is_deleted' => 'Y'
        ]);
    }

    /**
     * To get the external issue ID for meeting logging
     * @author  Rama selvan
     * @param   array $sprintId
     * @return  mixed
     */
    public function getExternalIssueIdForSprint($sprintId)
    {
        $sql = "SELECT external_issue_id
            FROM scrum_meeting_details
            WHERE r_sprint_id = :r_sprint_id:
              AND external_issue_id IS NOT NULL
            LIMIT 1";

        $query = $this->db->query($sql, ['r_sprint_id' => $sprintId]);

        if ($query->getNumRows() > 0) {
            $row = $query->getRow();
            return $row->external_issue_id;
        } else {
            return null;
        }
    }

    /**
     * @author Ruban Edward R
     * @param int $id
     * @return array
     * Retrieves product and meetType name while displaying model
     */
    public function getProductMeetType($mailInfo)
    {
        $sql = 'SELECT DISTINCT
                        sp.product_name, 
                        st.meeting_type_name 
                    FROM 
                        scrum_meeting_details AS md
                    JOIN 
                        scrum_product AS sp ON md.r_product_id = sp.external_project_id
                    JOIN 
                        scrum_meeting_type AS st ON md.r_meeting_type_id = st.meeting_type_id
                    WHERE
                        md.r_meeting_type_id = :meetType:
                        AND md.r_product_id = :product:';

        $result = $this->query($sql, [
            'meetType' => $mailInfo['meetType'],
            'product' => $mailInfo['product']
        ]);
        return $result->getResultArray();
    }
}
