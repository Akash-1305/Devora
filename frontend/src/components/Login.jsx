import { useState } from "react"
import './Login.css'

export default function Login(){
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    return(
        <>
            <form>
                <h1>Login</h1>
                <div>
                <label>Name:</label>
                <input value={name} onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div>
                <label>Password: </label>
                <input value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
            </form>
        </>
    )
}