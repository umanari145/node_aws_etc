<?php

require_once __DIR__ . '/vendor/autoload.php';
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

class Crud {

    private $firebase;

    private $database;

    public function __construct($filePath) {

        $serviceAccount = ServiceAccount::fromJsonFile(__DIR__. "/".$filePath);
        $this->firebase = (new Factory)
            ->withServiceAccount($serviceAccount)
            ->create();

        $this->database = $this->firebase->getDatabase();
    }

    /**
     * 新規作成
     *
     * @param  string $reference リファレンス
     * @param  array  $hash      挿入データ
     */
    public function create($reference, $hash) {

        $this->database->getReference($reference)
                        ->push($hash);
    }

    /**
     * 取得
     *
     * @param  string $reference リファレンス
     * @param  array  $hash      挿入データ
     */
    public function create($reference, $where) {

        $this->database->getReference($reference)
                        ->push($hash);
    }
}
