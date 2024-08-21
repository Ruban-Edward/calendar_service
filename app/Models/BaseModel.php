<?php

namespace App\Models;
use CodeIgniter\Model;

/**
 * @author yuvansri <yuvansri@infinitisoftware.net>
 * sample model 
 * @link https://codeigniter.com/user_guide/models/model.html
 *
 * Model name must be in singular form
 * sample 
 *  table name : users
 *  model name : UserModel (or) User
 */
class BaseModel extends Model
{
    /**
     * mention the table name in each model
     */
    protected $table      = 'users';
    /**
     * primary of key of the table
     */
    protected $primaryKey = 'id';
    /**
     * set autoincrement true if 
     * autoincrement column is in table
     * otherwise set to false 
     */
    protected $useAutoIncrement = true;
    
    protected $returnType     = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = ['name', 'email'];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    /**
     * @author samuel
     * purpose returning the user id of the user from the external id
     */
    public function getUserId($id)
    {
        $sql = "select user_id from scrum_user where external_employee_id=:Id:";
        $query = $this->query($sql, ['Id' => $id]);

        if ($query->getNumRows() > 0) {
            return $query->getResultArray();
        } else {
            return [];
        }
    }
}
