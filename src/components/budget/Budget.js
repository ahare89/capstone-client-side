import { useNavigate } from "react-router-dom"
import "./Budget.css"


export const Budget = () => {

    const navigate = useNavigate()
    return <>
    <button className="btn btn-primary" onClick={ () => { navigate("/create")}}>Create New Budget</button>
    
    </> 

}