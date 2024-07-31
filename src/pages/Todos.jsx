import ValorTotalTodos from "../componentes/ValorTotalTodos";

function Todos(){

    return(
        <div className='container-todos'>
        <h1>Todos</h1>
        <p>Esta é a página de Todos.</p>
        R$ <ValorTotalTodos /> 
      </div>
    );
}

export default Todos;