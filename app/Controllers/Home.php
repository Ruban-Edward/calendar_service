<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        // echo "hello";
        // return view('calendar');
        return view('welcome_message');
    }
}
