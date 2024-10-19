<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require_once("conexao.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $dataRecebida = json_decode(file_get_contents("php://input"), true);

    if (isset($dataRecebida['id']) && isset($dataRecebida['id_usuario'])) {
        $id = mysqli_real_escape_string($conexao, $dataRecebida['id']);
        $id_usuario = mysqli_real_escape_string($conexao, $dataRecebida['id_usuario']);

        $sqlVerifica = "SELECT * FROM SAIDAS WHERE ID = ? AND id_usuario = ?";
        $stmtVerifica = $conexao->prepare($sqlVerifica);
        if (!$stmtVerifica) {
            echo json_encode(array("error" => "Erro na preparação da consulta: " . $conexao->error));
            exit();
        }
        $stmtVerifica->bind_param("ii", $id, $id_usuario);
        $stmtVerifica->execute();
        $resultVerifica = $stmtVerifica->get_result();

        if ($resultVerifica->num_rows > 0) {
            $sql = "UPDATE SAIDAS SET CS_PAGO = 1 WHERE ID = ? AND id_usuario = ?";
            $stmt = $conexao->prepare($sql);
            if (!$stmt) {
                echo json_encode(array("error" => "Erro na preparação da consulta: " . $conexao->error));
                exit();
            }
            $stmt->bind_param("ii", $id, $id_usuario);

            if ($stmt->execute()) {
                echo json_encode(array("message" => "Atualização realizada com sucesso"));
            } else {
                echo json_encode(array("error" => "Erro ao atualizar dados: " . $stmt->error));
            }
        } else {
            echo json_encode(array("error" => "Registro não encontrado ou não pertence ao usuário"));
        }

        $stmtVerifica->close();
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Dados inválidos"));
    }
} else {
    echo json_encode(array("error" => "Método não permitido"));
}

$conexao->close();
?>
