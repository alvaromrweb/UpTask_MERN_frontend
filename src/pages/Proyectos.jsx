import useProyectos from "../hooks/useProyectos.jsx"
import PreviewProyecto from "../components/PreviewProyecto.jsx"
import Alerta from "../components/Alerta.jsx"


let socket

const Proyectos = () => {
  const { proyectos, alerta } = useProyectos()

  
  
  return (
    <>
      <h1 className='text-4xl font-black'>Proyectos</h1>

      {alerta?.msg && <Alerta alerta={alerta} />}
      <div className="bg-white shadow mt-10 rounded-lg">
        {proyectos.length <= 0 ? (
          <p className="text-center text-gray-700 uppercase p-5">No hay proyectos</p>
        ) : 
          proyectos.map(proyecto => (
            <PreviewProyecto key={proyecto._id} proyecto={proyecto} />
          ))
        }
      </div>
    </>
  )
}

export default Proyectos