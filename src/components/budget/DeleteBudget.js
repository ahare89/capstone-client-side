import { useNavigate } from "react-router-dom"

export const DeleteBudget = ({id, getAllBudgets}) => {

    const navigate = useNavigate()

    const handleClickButton = (clickEvent) => {
        clickEvent.preventDefault()
        fetch(`http://localhost:8088/budgets/${id}`,{
         method: "DELETE",
         headers: {
            "Content-type": "application/json"
         }
        })
        .then(res => res.json())
        .then(() => {
            getAllBudgets()
        })
    }
    return <button onClick={(clickEvent) => handleClickButton(clickEvent)} className="btn btn-primary"> Delete</button>
}