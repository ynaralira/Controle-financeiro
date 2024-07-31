<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require_once("conexao.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $dataRecebida = json_decode(file_get_contents("php://input"), true);

    if (isset($dataRecebida['valor']) && isset($dataRecebida['id_usuario'])) {
        $valor = mysqli_real_escape_string($conexao, $dataRecebida['valor']);
        $id_usuario = mysqli_real_escape_string($conexao, $dataRecebida['id_usuario']);

        $valor = str_replace(',', '.', $valor);

        $sqlTotal = "SELECT SUM(VALOR) AS total FROM RECEITAS WHERE id_usuario = ?";
        $stmtTotal = $conexao->prepare($sqlTotal);
        $stmtTotal->bind_param("i", $id_usuario);
        $stmtTotal->execute();
        $resultTotal = $stmtTotal->get_result();
        $rowTotal = $resultTotal->fetch_assoc();
        $total = $rowTotal['total'];

        if ($valor > $total) {
            echo json_encode(array("error" => "Valor solicitado é maior que o total disponível na tabela receitas"));
            exit;
        } elseif ($valor == $total) {
            $sqlDelete = "DELETE FROM RECEITAS WHERE id_usuario = ?";
            $stmtDelete = $conexao->prepare($sqlDelete);
            $stmtDelete->bind_param("i", $id_usuario);

            if ($stmtDelete->execute()) {
                echo json_encode(array("message" => "Todas as entradas foram excluídas com sucesso"));
            } else {
                echo json_encode(array("error" => "Erro ao excluir entradas: " . $stmtDelete->error));
            }
            $stmtDelete->close();
        } else {
            $sqlUpdate = "UPDATE RECEITAS SET VALOR = VALOR - ? WHERE VALOR >= ? AND id_usuario = ? LIMIT 1";
            $stmtUpdate = $conexao->prepare($sqlUpdate);
            $stmtUpdate->bind_param("dii", $valor, $valor, $id_usuario);

            if ($stmtUpdate->execute()) {
                echo json_encode(array("message" => "Pagamento realizado com sucesso"));
            } else {
                echo json_encode(array("error" => "Erro ao atualizar entradas: " . $stmtUpdate->error));
            }
            $stmtUpdate->close();
        }
        $stmtTotal->close();
    } else {
        echo json_encode(array("error" => "Dados inválidos"));
    }
} else {
    echo json_encode(array("error" => "Método não permitido"));
}

$conexao->close();
?>
