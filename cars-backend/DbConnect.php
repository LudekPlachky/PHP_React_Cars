<?php
class DbConnect
{
private $server = 'md413.wedos.net';
private $dbname = 'd351838_cars';
private $user = 'a351838_cars';
private $pass = '3AkpC2H6';
private $options = array(
PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
PDO::ATTR_EMULATE_PREPARES => false,
);
public function connect()
{
try {
$conn = new PDO('mysql:host=' . $this->server .
';dbname=' . $this->dbname . ';charset=utf8',
$this->user, $this->pass, $this->options );
return $conn;
} catch (PDOException $e) {
echo "Database Error: " . $e->getMessage();
}
}
}