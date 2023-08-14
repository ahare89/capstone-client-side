import { useState } from "react"
import { useParams } from "react-router-dom"
import "./CreateIncome.css"

export const CreateIncome = ({ onIncomeAdded}) => {

    const {budgetId} = useParams()

    const [income, setIncome] = useState({
        budgetId: budgetId,
        amount: ""
    })

    const handleSaveButtonClick = (event) => {
        event.preventDefault()


        const incomeToSendToAPI = {
            budgetId: parseInt(budgetId),
            amount: income.amount ? parseInt(income.amount) : 0
        }

        fetch(`http://localhost:8088/income`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(incomeToSendToAPI)
        })
            .then(res => res.json())
            .then(() => {
                console.log("Success")
                if (onIncomeAdded) {
                    onIncomeAdded()
                }
                setIncome({
                    budgetId: budgetId,
                    amount: ""
                })
            })


    }

    return <>
    <div className="incomeField container mt-4">
        <h4>Add Income</h4>
        <label htmlFor="income"></label>
        <input
            required autoFocus
            type="text"
            className="form-control"
            placeholder="$0.00"
            value={income.amount}
            onChange={
                (evt) => {
                    const copy = {...income}
                    copy.amount = evt.target.value
                    setIncome(copy)
                }
            } />

        </div>
        <button onClick={(clickEvent) => handleSaveButtonClick(clickEvent)} className="btn btn-success budget-margin-bottom">Save</button>
    </>
}