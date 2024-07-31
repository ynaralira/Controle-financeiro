<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

include_once "conexao.php";

if (!$conexao) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão com o banco de dados']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Dados ausentes']);
    exit();
}

$email = $data['email'];
$password = strval($data['password']);

$stmt = $conexao->prepare("SELECT id_usuario, nm_usuario, email FROM usuarios WHERE email = ? AND senha = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Erro na preparação da consulta']);
    exit();
}

$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($id_usuario, $nm_usuario, $email);
    $stmt->fetch();
    
    echo json_encode([
        'success' => true,
        'id_usuario' => $id_usuario,
        'nm_usuario' => $nm_usuario,
        'email' => $email
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos']);
}

$stmt->close();
$conexao->close();
?>
