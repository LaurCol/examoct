import React, { useState, useContext } from 'react'
import authAPI from '../services/authAPI'
import AuthContext from '../contexts/AuthContext'
import Field from '../components/forms/Field'
import jwtDecode from "jwt-decode"
import { toast } from 'react-toastify'


const LoginPage = (props) => {



    const {setIsAuthenticated,setIsAdmin,isAdmin} = useContext(AuthContext)

            const [credentials, setCredentials] = useState({
            username: "",
            password: ""
            })

            const [error, setError ] = useState("")

            const handleChange = (event) => {
            const value = event.currentTarget.value
            const name = event.currentTarget.name

            // ... copie l'objet credentials et la virgule permet de dire avec modification (ajout ou remplacement)
            // si on laisse simplement name, il va venir écrire dans l'objet une prop name mais avec le crochet, il va prendre la valeur de name (ex: username)
            setCredentials({...credentials, [name]:value})
            }

            const handleSubmit = async (event) => {
                event.preventDefault()
                //console.log(credentials)
                try{
                const response = await authAPI.authenticate(credentials)
                const data = jwtDecode(response)
                for(var role of data.roles){
                if (role === 'ROLE_ADMIN'){
                    setIsAdmin(true)
                }
                }

                setError("")
                setIsAuthenticated(true)
                toast.success("Vous êtes connecté")
                props.history.replace("/")
                }catch(error){
                setError("Aucun compte ne possède cette adresse e-mail ou les informations ne correspondent pas")
                toast.error("Une erreur est survenue")
                }
            }


    return (
        <div className="content">
            <div className="container">
                <div className="center login">
                    <h1>Connexion</h1>
                    <form onSubmit={handleSubmit}>
                        <Field 
                            label="Adresse Email"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Adresse email de connexion"
                            error={error}
                        />
                        <Field
                            label="Mot de passe"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            type="password"
                            error=""
                        />
                        <div className="form-group">
                            <button type="submit" className="btn btn-success">Connexion</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;




    