<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

header('Content-Type: application/json');

include_once "conexao.php";

function getValores($conexao, $id_usuario) {
    $data = array(
        'valor_entrada' => [],
        'valor_saida' => [],
        'valor_pagos' => []
    );
    $sqlEntradas = "SELECT valor FROM RECEITAS WHERE id_usuario = ?";
    $stmtEntradas = $conexao->prepare($sqlEntradas);
    if (!$stmtEntradas) {
        echo json_encode(['error' => 'Erro na preparação da consulta Entradas: ' . $conexao->error]);
        exit();
    }
    $stmtEntradas->bind_param("i", $id_usuario);
    $stmtEntradas->execute();
    $resultEntradas = $stmtEntradas->get_result();

    $sqlSaidas = "SELECT valor FROM SAIDAS WHERE CS_PAGO = 0 AND id_usuario = ?";
    $stmtSaidas = $conexao->prepare($sqlSaidas);
    if (!$stmtSaidas) {
        echo json_encode(['error' => 'Erro na preparação da consulta Saídas: ' . $conexao->error]);
        exit();
    }
    $stmtSaidas->bind_param("i", $id_usuario);
    $stmtSaidas->execute();
    $resultSaidas = $stmtSaidas->get_result();

    $sqlPagos = "SELECT valor FROM SAIDAS WHERE CS_PAGO = 1 AND id_usuario = ?";
    $stmtPagos = $conexao->prepare($sqlPagos);
    if (!$stmtPagos) {
        echo json_encode(['error' => 'Erro na preparação da consulta Pagos: ' . $conexao->error]);
        exit();
    }
    $stmtPagos->bind_param("i", $id_usuario);
    $stmtPagos->execute();
    $resultPagos = $stmtPagos->get_result();

    if ($resultEntradas === false || $resultSaidas === false || $resultPagos === false) {
        $error = $conexao->error;
        echo json_encode(['error' => 'Erro na execução das consultas: ' . $error]);
        exit();
    }

    while ($row = $resultEntradas->fetch_assoc()) {
        $data['valor_entrada'][] = $row;
    }

    while ($row = $resultSaidas->fetch_assoc()) {
        $data['valor_saida'][] = $row;
    }

    while ($row = $resultPagos->fetch_assoc()) {
        $data['valor_pagos'][] = $row;
    }

    echo json_encode($data);
    $stmtEntradas->close();
    $stmtSaidas->close();
    $stmtPagos->close();
    $conexao->close();
}

$data = json_decode(file_get_contents('php://input'), true);
$id_usuario = isset($data['id_usuario']) ? intval($data['id_usuario']) : 0;

if ($id_usuario === 0) {
    echo json_encode(['success' => false, 'message' => 'ID do usuário ausente']);
    exit();
}

getValores($conexao, $id_usuario);

?>
