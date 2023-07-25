import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const CreateExpense = () => {
    
    const navigate = useNavigate()

    const localBudgetUser = localStorage.getItem("budget_user")
    const budgetUserObject = JSON.parse(localBudgetUser)

    const { budgetId } = useParams()

    const [budgets, setBudgets] = useState([])

    const [expense, setExpense] = useState({
        budgetId: parseInt(budgetId),
        categoryId: "",
        name: "",
        amount: ""
    })

    const [category, setCategory] = useState([])

    useEffect(() => {
        fetch(`http://localhost:8088/budgets`)
        .then(res => res.json())
        .then((budgetArray) => {
            setBudgets(budgetArray)
        })
    }, []) 

    useEffect(() => {
        fetch(`http://localhost:8088/categories`)
        .then(res => res.json())
        .then(
            (categoryArray) => {
                setCategory(categoryArray)
            }
        )
    },
    [])
    
    const handleSaveButtonClick = (event) => {
        event.preventDefault()

        const expenseToSendToAPI = {
            budgetId: expense.budgetId,
            categoryId: expense.categoryId,
            name: expense.name,
            amount: parseFloat(expense.amount)


        }

        return fetch(`http://localhost:8088/expenses`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expenseToSendToAPI)
        })
            .then(res => res.json())
            .then(() => {
                navigate(`/budget/${budgetId}`)
            })



    }
    

    return (
        <form className="expenseForm">
            <h2 className="expenseForm__Title">New Expense</h2>
            <fieldset>
            <div className="form-group">
                <label htmlFor="description">Description: </label>
                <input
                    required autoFocus
                    type="text"
                    className="form-control"
                    palceholder="Please enter the name of the expense"
                    value={expense.name}
                    onChange={
                        (evt) => {
                            const copy = {...expense}
                            copy.name = evt.target.value
                            setExpense(copy)
                        }
                    } />
            </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="amount">Amount: </label>
                    <input
                        required autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Please enter the amount"
                        value={expense.amount}
                        onChange={
                            (evt) => {
                                const copy = {...expense}
                                copy.amount = (evt.target.value)
                                setExpense(copy)
                            }
                        } />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="budget">Category: </label>
                    <select id="category"
                        className="form-control"
                        value={expense.categoryId}
                        onChange={(evt) => {
                            const copy={...expense}
                            copy.categoryId = parseInt(evt.target.value)
                            setExpense(copy)
                        }}>
                            {category.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
                        </select>
                </div>
            </fieldset>
            <button onClick={(clickEvent) => handleSaveButtonClick(clickEvent)} className="btn btn-primary">Save</button>

    </form>
    )
}