<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require_once("conexao.php");

$data = json_decode(file_get_contents('php://input'), true);
$id_conta = isset($data['id_conta']) ? intval($data['id_conta']) : 0;

if ($id_conta === 0) {
    echo json_encode(['success' => false, 'message' => 'ID do usuário ausente']);
    exit();
}

function handleError($stmt, $conexao) {
    if ($stmt === false) {
        echo json_encode(['success' => false, 'message' => 'Erro na preparação da consulta: ' . $conexao->error]);
        exit();
    }
}

$data = [
    'transacao_entrada' => [],
    'transacao_saida' => [],
    'transacao_pagos' => [],
    'transacao_todas' => []
];

$sqlEntradas = "SELECT ID, DESCRICAO, DATA, VALOR, ID_FORMA_PAGAMENTO FROM RECEITAS WHERE id_conta = ?";
$stmtEntradas = $conexao->prepare($sqlEntradas);
handleError($stmtEntradas, $conexao);
$stmtEntradas->bind_param("i", $id_conta);
$stmtEntradas->execute();
$resultEntradas = $stmtEntradas->get_result();

$sqlSaidas = "SELECT ID, DESCRICAO, DATA, VALOR, ID_FORMA_PAGAMENTO FROM SAIDAS WHERE CS_PAGO = 0 AND id_conta = ?";
$stmtSaidas = $conexao->prepare($sqlSaidas);
handleError($stmtSaidas, $conexao);
$stmtSaidas->bind_param("i", $id_conta);
$stmtSaidas->execute();
$resultSaidas = $stmtSaidas->get_result();

$sqlPagos = "SELECT ID, DESCRICAO, DATA, VALOR, ID_FORMA_PAGAMENTO FROM SAIDAS WHERE CS_PAGO = 1 AND id_conta = ?";
$stmtPagos = $conexao->prepare($sqlPagos);
handleError($stmtPagos, $conexao);
$stmtPagos->bind_param("i", $id_conta);
$stmtPagos->execute();
$resultPagos = $stmtPagos->get_result();

$sqlTodas = "
    SELECT ID, ID_CONTA, VALOR, CS_PAGO, 
     CASE 
        WHEN CS_PAGO = 1 THEN DT_PAGO 
        ELSE DATA 
     END AS DATA, 
    DESCRICAO, ID_FORMA_PAGAMENTO,  
    CASE 
        WHEN CS_PAGO = 1 THEN 'P'
        ELSE 'S'
    END as CS_TIPO
    FROM SAIDAS
    WHERE id_conta = ?

    UNION 
    SELECT ID, ID_CONTA, VALOR, 0 AS CS_PAGO, DATA, DESCRICAO, ID_FORMA_PAGAMENTO, 'R' as CS_TIPO
    FROM RECEITAS
    WHERE id_conta = ?
    ORDER BY ID DESC, DATA DESC, DESCRICAO 
";

$stmtTodas = $conexao->prepare($sqlTodas);
handleError($stmtTodas, $conexao);
$stmtTodas->bind_param("ii", $id_conta, $id_conta);
$stmtTodas->execute();
$resultTodas = $stmtTodas->get_result();

while ($row = $resultEntradas->fetch_assoc()) {
    $data['transacao_entrada'][] = $row;
}

while ($row = $resultSaidas->fetch_assoc()) {
    $data['transacao_saida'][] = $row;
}

while ($row = $resultPagos->fetch_assoc()) {
    $data['transacao_pagos'][] = $row;
}

while ($row = $resultTodas->fetch_assoc()) {
    $data['transacao_todas'][] = $row;
}

echo json_encode($data);

$stmtEntradas->close();
$stmtSaidas->close();
$stmtPagos->close();
$stmtTodas->close();
$conexao->close();

?>
