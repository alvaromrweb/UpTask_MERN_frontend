import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <>
        <main className="container mx-auto  p-5 md:flex md:justify-center">
            <div className="md:w-1/3 lg:w-2/5 mt-5 md:mt-20">
                <Outlet />

            </div>
            
        </main>
    </>
  )
}

export default AuthLayout