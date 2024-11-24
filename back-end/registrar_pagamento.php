<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require_once("conexao.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $dataRecebida = json_decode(file_get_contents("php://input"), true);

    if (isset($dataRecebida['id'], $dataRecebida['id_conta'], $dataRecebida['dt_pago'])) {
        $id = mysqli_real_escape_string($conexao, $dataRecebida['id']);
        $id_conta = mysqli_real_escape_string($conexao, $dataRecebida['id_conta']);
        $dt_pago = mysqli_real_escape_string($conexao, $dataRecebida['dt_pago']);

        $sqlVerifica = "SELECT 1 FROM SAIDAS WHERE ID = ? AND id_conta = ?";
        $stmtVerifica = $conexao->prepare($sqlVerifica);
        if (!$stmtVerifica) {
            echo json_encode(["error" => "Erro na preparação da consulta: " . $conexao->error]);
            exit();
        }
        $stmtVerifica->bind_param("ii", $id, $id_conta);
        $stmtVerifica->execute();
        $resultVerifica = $stmtVerifica->get_result();

        if ($resultVerifica->num_rows > 0) {
            // Atualizar os dados
            $sql = "UPDATE SAIDAS SET CS_PAGO = 1, DT_PAGO = ? WHERE ID = ? AND id_conta = ?";
            $stmt = $conexao->prepare($sql);
            if (!$stmt) {
                echo json_encode(["error" => "Erro na preparação da consulta: " . $conexao->error]);
                exit();
            }
            $stmt->bind_param("sii", $dt_pago, $id, $id_conta);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Atualização realizada com sucesso"]);
            } else {
                echo json_encode(["error" => "Erro ao atualizar dados: " . $stmt->error]);
            }
        } else {
            echo json_encode(["error" => "Registro não encontrado ou não pertence ao usuário"]);
        }

        $stmtVerifica->close();
        $stmt->close();
    } else {
        echo json_encode(["error" => "Dados inválidos"]);
    }
} else {
    echo json_encode(["error" => "Método não permitido"]);
}

$conexao->close();
?>
