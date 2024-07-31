import ValorTotalInvestimentos from "../componentes/ValorTotalInvestimentos";
import Header from "../componentes/Header";
import Buttons from "../componentes/Buttons";

function Investimentos(){
    return(
      <div>
        <Header/>
        <div className='container-investimentos'>
            <div className='box'>
              <h1>Investimentos</h1>
              <div className="total-investimentos">
              Total: <span className="valor">R$ <ValorTotalInvestimentos /> </span>
              </div>
              <Buttons/>
            </div>
        </div>
      </div>
    );
}

export default Investimentos;