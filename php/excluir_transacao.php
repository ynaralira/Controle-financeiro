<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require_once("conexao.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $dataRecebida = json_decode(file_get_contents("php://input"), true);

    if (isset($dataRecebida['id']) && isset($dataRecebida['tipo']) && isset($dataRecebida['id_usuario'])) {
        $id = mysqli_real_escape_string($conexao, $dataRecebida['id']);
        $tipo = mysqli_real_escape_string($conexao, $dataRecebida['tipo']);
        $id_usuario = intval($dataRecebida['id_usuario']);  

        if ($tipo === "entrada") {
            $table = "RECEITAS";
        } else{
            $table = "SAIDAS";
        } 
        $sql = "DELETE FROM $table WHERE ID = '$id' AND id_usuario = $id_usuario";

        if (mysqli_query($conexao, $sql)) {
            echo json_encode(array("message" => "Exclusão realizada com sucesso"));
        } else {
            echo json_encode(array("error" => "Erro ao excluir dados: " . mysqli_error($conexao)));
        }
    } else {
        echo json_encode(array("error" => "Dados inválidos"));
    }
} else {
    echo json_encode(array("error" => "Método não permitido"));
}

?>
