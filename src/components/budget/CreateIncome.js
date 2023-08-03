import { useState } from "react"
import { useParams } from "react-router-dom"

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
            })


    }

    return <>
    <div>
        <label htmlFor="income">Add Income:</label>
        <input
            required autoFocus
            type="text"
            className="form-control"
            placeholder="$1000.00"
            value={income.amount}
            onChange={
                (evt) => {
                    const copy = {...income}
                    copy.amount = evt.target.value
                    setIncome(copy)
                }
            } />

        </div>
        <button onClick={(clickEvent) => handleSaveButtonClick(clickEvent)} className="btn btn-primary">Save</button>
    </>
}