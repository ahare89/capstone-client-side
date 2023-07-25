import { useNavigate } from "react-router-dom"


export const Budget = () => {

    const navigate = useNavigate()
    return <>
    <button onClick={ () => { navigate("/create")}}>Create New Budget</button>
    <button onClick={() => { navigate("/mybudgets")}}>All My Budgets</button>
    </> 

}