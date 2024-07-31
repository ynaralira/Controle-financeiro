<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require_once("conexao.php");

$data = json_decode(file_get_contents('php://input'), true);
$id_usuario = isset($data['id_usuario']) ? intval($data['id_usuario']) : 0;

if ($id_usuario === 0) {
    echo json_encode(['success' => false, 'message' => 'ID do usuário ausente']);
    exit();
}

function handleError($stmt, $conexao) {
    if ($stmt === false) {
        echo json_encode(['success' => false, 'message' => 'Erro na preparação da consulta: ' . $conexao->error]);
        exit();
    }
}


$sqlEntradas = "SELECT ID, DESCRICAO, DATA, VALOR, ID_FORMA_PAGAMENTO FROM RECEITAS WHERE id_usuario = ?";
$stmtEntradas = $conexao->prepare($sqlEntradas);
handleError($stmtEntradas, $conexao);
$stmtEntradas->bind_param("i", $id_usuario);
$stmtEntradas->execute();
$resultEntradas = $stmtEntradas->get_result();

$sqlSaidas = "SELECT ID, DESCRICAO, DATA, VALOR, ID_FORMA_PAGAMENTO FROM SAIDAS WHERE CS_PAGO = 0 AND id_usuario = ?";
$stmtSaidas = $conexao->prepare($sqlSaidas);
handleError($stmtSaidas, $conexao);
$stmtSaidas->bind_param("i", $id_usuario);
$stmtSaidas->execute();
$resultSaidas = $stmtSaidas->get_result();

$sqlPagos = "SELECT ID, DESCRICAO, DATA, VALOR, ID_FORMA_PAGAMENTO FROM SAIDAS WHERE CS_PAGO = 1 AND id_usuario = ?";
$stmtPagos = $conexao->prepare($sqlPagos);
handleError($stmtPagos, $conexao);
$stmtPagos->bind_param("i", $id_usuario);
$stmtPagos->execute();
$resultPagos = $stmtPagos->get_result();


$data = array(
    'transacao_entrada' => [],
    'transacao_saida' => [],
    'transacao_pagos' => []
);

while ($row = $resultEntradas->fetch_assoc()) {
    $data['transacao_entrada'][] = $row;
}

while ($row = $resultSaidas->fetch_assoc()) {
    $data['transacao_saida'][] = $row;
}

while ($row = $resultPagos->fetch_assoc()) {
    $data['transacao_pagos'][] = $row;
}

echo json_encode($data);


$stmtEntradas->close();
$stmtSaidas->close();
$stmtPagos->close();
$conexao->close();

?>
