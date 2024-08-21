<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\CLIRequest;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\Helpers\CustomHelpers;
use CodeIgniter\Model;


/**
 * Class BaseController
 *
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 * Extend this class in any new controllers:
 *     class Home extends BaseController
 *
 * For security be sure to declare any new methods as protected or private.
 */
abstract class BaseController extends Controller
{
    /**
     * Instance of the main Request object.
     *
     * @var CLIRequest|IncomingRequest
     */
    protected $request;


    /**
     * An array of helpers to be loaded automatically upon
     * class instantiation. These helpers will be available
     * to all other controllers that extend BaseController.
     *
     * @var list<string>
     */
    protected $helpers = [];

    /**
     * Be sure to declare properties for any property fetch you initialized.
     * The creation of dynamic property is deprecated in PHP 8.2.
     */
    protected $session;
    protected $rolePermissionModel;
    protected $validation;
    public function __construct()
    {
        $this->session = session();
    }

    /**
     * To control and hide the buttons based on the user role
     * @author Ruban Edward
     * @param string $routeUrl
     * @return bool
     */
    // protected function hasPermission($routeUrl)
    // {
    //     $userRoleId = $this->session->get('role_id');

    //     // Get the permission ID for the route
    //     $permissionModel = new \App\Models\PermissionModel();
    //     $permission = $permissionModel->where('routes_url', $routeUrl)->first();

    //     if ($permission) {
    //         $permissionId = $permission['permission_id'];

    //         // Check if the user's role has this permission
    //         $rolePermission = $this->rolePermissionModel->where('r_role_id', $userRoleId)
    //             ->where('r_permission_id', $permissionId)
    //             ->where('is_deleted', 'N')
    //             ->first();


    //         return $rolePermission !== null;
    //     }

    //     return false;
    // }

    // /**
    //  * @return void
    //  */
    // public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    // {
    //     // Do Not Edit This Line
    //     parent::initController($request, $response, $logger);

    //     helper('permission'); //To check the user role with the helper function to use it in the view
    // }

    //Extending default view
    public function template_view($view, $view_data = null, $title = '', $breadcrumbs = [])
    {
        $data = [
            'view' => $view,
            'data' => $view_data,
            'title' => $title,
            'breadcrumbs' => $breadcrumbs,
        ];

        return view('calendar', $data);
    }

    /**
* @param Model $model
*
* @return bool|array
*/
    public function hasInvalidInput(Model $model, $data)
    {
        $this->validation = \Config\Services::validation();
        $validationRules = $model->getDetailValidationRules();
        $validationMessages = $model->getValidationMessages();
        $this->validation->setRules($validationRules, $validationMessages);
        if (!$this->validation->run($data)) {
            return $this->validation->getErrors();
        } else {
            return true;
        }
    }

    /**
    * AuthController::userRoleSet()
    *
    * Set the user roles for the users 
    */                 
    public function userRoleSet($role,$userRoles,$userRoleId){
        // Determine role based on role type
        switch (true) {
            case in_array($role, $userRoles['developer']):
                return $roleId = $userRoleId['developer'];
            case in_array($role, $userRoles['project_manager']):
                return $roleId = $userRoleId['project_manager'];
            case in_array($role, $userRoles['product_manager']):
                return $roleId = $userRoleId['product_manager'];
            case in_array($role, $userRoles['business_analyst']):
                return $roleId = $userRoleId['business_analyst'];
            default:
                return $roleId = $userRoleId['developer'];
        }
    } 
}
