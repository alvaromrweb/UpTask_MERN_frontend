import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";


const ConfirmarCuenta = () => {

  const { token } = useParams();
  const [alerta, setAlerta] = useState({})

  useEffect(() => {
    console.log('llamada')
    const callAPI = async () => {
      try {
        const { data } = await clienteAxios.get(`/usuarios/confirmar/${token}`)
        
        setAlerta({
          error: false,
          msg: data.msg
        })
        
      } catch (error) {
        setAlerta({
            error: true,
            msg: error.response.data.msg
        })
        console.log(error)
      }

    }
    callAPI()
  }, [])
  
  return (
    <>
        
      <h1 className='text-sky-600 font-black text-6xl text-center'>Confirma tu cuenta</h1>
      <div>
        {alerta.msg && <Alerta alerta={alerta} />}
      </div>
      <p className="text-3xl mt-10 text-center">Volver a <Link to="/" className="text-sky-600">UpTask</Link></p>
        
      
    </>
  )
}

export default ConfirmarCuenta