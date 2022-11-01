import FormularioColaborador from "../components/FormularioColaborador"
import { useEffect } from "react"
import useProyectos from "../hooks/useProyectos"
import { useParams } from "react-router-dom"
import Alerta from "../components/Alerta"

const NuevoColaborador = () => {

    const {getProyecto, proyecto, cargando, colaborador, addColaborador, alerta} = useProyectos()
    const params = useParams()

    useEffect(() => {
      getProyecto(params.id)
    
    }, [])

    if(!proyecto?._id) return <Alerta alerta={alerta} />
    
  return (
    <>
        <h1 className='text-4xl font-black'>Añadir colaborador al proyecto: {proyecto.nombre}</h1>
        <div className='mt-10 flex justify-center'>
            <FormularioColaborador />
        </div>

        {cargando ? <p className="text-center">Cargando...</p> : colaborador?._id && (
          <div className="flex justify-center mt-10">
            <div className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow">
              <h2 className="text-center mb-10 text-xl font-bold">Resultado:</h2>
              <div className="flex justify-between items-center">
                <p>{colaborador.nombre}</p>

                <button className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm" type="button" onClick={() => addColaborador({ email: colaborador.email})}>Agregar al proyecto</button>
              </div>
            </div>
          </div>
        )}
    </>
  )
}

export default NuevoColaborador