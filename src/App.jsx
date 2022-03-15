import { useState, useEffect } from 'react'

//Importando componenetes creados
import Header from './components/Header'
import Filtros from './components/Filtros';
//import NuevoPresupuesto from './components/NuevoPresupuesto'
import ListadoGastos from './components/ListadoGastos';
import Modal from './components/Modal'
import { generarId } from "./helpers";
import iconoNuevoGasto from './img/nuevo-gasto.svg'


function App() {
  const [presupuesto, setPresupuesto] = useState(
    localStorage.getItem('presupuesto') ?? 0
  );
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);
  const [modal, setModal] = useState(false)
  const [animarModal, setAnimarModal] = useState(false)
  //Obteniendo gastos en el arreglo
  const [gastos, setGastos] = useState(
    localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
  );
  const [gastoEditar, setGastoEditar] = useState({});

  //Filtrando
  const [filtro, setFiltro] = useState('');
  const [gastosFiltrados, setGastosFiltrados] = useState([]);


  useEffect(() => {
    if(Object.keys(gastoEditar).length > 0){
      setModal(true)
  
      setTimeout(() => {
        setAnimarModal(true)
      }, 200);
    }
  }, [gastoEditar]);

  const handleNuevoGasto = ()=>{
    setModal(true)
    setGastoEditar({})

    setTimeout(() => {
      setAnimarModal(true)
    }, 200);
  }

  useEffect(() => {
    if (filtro) {
      //Filtrando gastos por categorias
      const gastosFiltrados = gastos.filter(gasto => gasto.categoria === filtro)

      setGastosFiltrados(gastosFiltrados)
    }
  }, [filtro]);

  //Funcion para guardar en local estorage
  useEffect(() => {
    Number(localStorage.setItem('presupuesto', presupuesto ?? 0))
  }, [presupuesto]);

  useEffect(() => {
    const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0

    if(presupuestoLS > 0) {
      setIsValidPresupuesto(true)
    }
  }, []);

  //Guardando gastos en Local Storage
  useEffect(() => {
    localStorage.setItem('gastos',JSON.stringify(gastos) ?? [])
  }, [gastos]);
  //Guardando los gastos registrados
  const guardarGasto = gasto =>{
    if(gasto.id) {
      //Actualizar
      const gastosActualizados = gastos.map( gastoState => gastoState.id === gasto.id ? gasto : gastoState)
      setGastos(gastosActualizados);
      setGastoEditar({})
    }else{
      //Nuevo gasto
      gasto.id = generarId();
      gasto.fecha = Date.now();
      setGastos([...gastos, gasto])
    }

    setAnimarModal(false)
    setTimeout(() => {
      setModal(false)
    }, 200);
  }

  const eliminarGasto = id =>{
    const gastosActualizados = gastos.filter(gasto => gasto.id !== id);
    setGastos(gastosActualizados)
  }

  return (
    <div className={ modal ? 'fijar' : '' }>
      <Header
        gastos = {gastos}
        setGastos = {setGastos}
        presupuesto = {presupuesto}
        setPresupuesto = {setPresupuesto}
        isValidPresupuesto = {isValidPresupuesto}
        setIsValidPresupuesto = {setIsValidPresupuesto}

      />

      {isValidPresupuesto && (
        <>
          <main>
            <Filtros
              filtro = {filtro}
              setFiltro = {setFiltro}
            />
            
            <ListadoGastos
              gastos = {gastos}
              setGastoEditar = {setGastoEditar}
              eliminarGasto = {eliminarGasto}
              filtro = {filtro}
              gastosFiltrados = {gastosFiltrados}
            />

          </main>

          <div className="nuevo-gasto">
            <img 
              src={iconoNuevoGasto} 
              alt="icono nuevo gasto" 
              onClick={handleNuevoGasto}
              />
          </div>
        </>
      )}

    {modal && <Modal
                setModal = {setModal}
                animarModal = {animarModal}
                setAnimarModal = {setAnimarModal}
                guardarGasto = {guardarGasto}
                gastoEditar = {gastoEditar}
                setGastoEditar = {setGastoEditar}
              />}

    </div>
  )
}

export default App

