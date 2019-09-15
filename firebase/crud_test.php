<?php

require_once 'crud.php';


$crud = new Crud('firebase_key.json');
$crud->create('member', [
    'name'=> 'test',
    'email' => 'hoge@gmail.com'
]);
