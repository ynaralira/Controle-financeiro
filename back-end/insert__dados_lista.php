<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

header('Content-Type: application/json');

require_once("conexao.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $dataRecebida = json_decode(file_get_contents("php://input"), true);

    $descricao = $dataRecebida['descricao'];
    $data = $dataRecebida['data']; 
    $valor = $dataRecebida['valor'];
    $formaPagamento = $dataRecebida['formaPagamento'];
    $tipoTransacao = $dataRecebida['tipoTransacao'];
    $id_conta = isset($dataRecebida['id_conta']) ? intval($dataRecebida['id_conta']) : 0;

    if ($tipoTransacao === 'entrada') {
        $sql = "INSERT INTO RECEITAS (descricao, data, valor, id_forma_pagamento, id_conta) VALUES ('$descricao', '$data', '$valor', '$formaPagamento', $id_conta)";
    } elseif ($tipoTransacao === 'saida') {
        $sql = "INSERT INTO SAIDAS (descricao, data, valor, id_forma_pagamento, cs_pago, id_conta) VALUES ('$descricao', '$data', '$valor', '$formaPagamento', 0, $id_conta)";
    } else {
        echo json_encode(array("error" => "Tipo de transação inválido"));
        exit();
    }

    if (mysqli_query($conexao, $sql)) {
        echo json_encode(array("message" => "Inserção realizada com sucesso"));
    } else {
        echo json_encode(array("error" => "Erro ao inserir dados: " . mysqli_error($conexao)));
    }
} else {
    echo json_encode(array("error" => "Método não permitido"));
}

?>
