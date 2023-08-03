import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const CreateExpense = ({expenseState, setExpenses, budget, setBudget, setCategoriesUpdateTrigger}) => {
    
    const navigate = useNavigate()

    const localBudgetUser = localStorage.getItem("budget_user")
    const budgetUserObject = JSON.parse(localBudgetUser)

    const { budgetId } = useParams()
    const [category, setCategory] = useState([])

    //state variable for expense
    const [expense, setExpense] = useState({
        budgetId: parseInt(budgetId),
        categoryId: "",
        name: "",
        amount: ""
    });


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
        //fetch the current budget from database
        fetch(`http://localhost:8088/budgets/${budgetId}`)
        .then(res => res.json())
        .then(budgetData => {
            //if budgetData.categories does not include the category for the expense we're adding--
            if (!budgetData.categories.includes(expense.categoryId)) {
                //--push the category to the budget
                budgetData.categories.push(expense.categoryId);
                //update budget with the added category
                return fetch(`http://localhost:8088/budgets/${budgetId}`,{
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(budgetData)
                })
                //implicit return of expenseToSendToAPI for next .then
                .then(() => expenseToSendToAPI)
            } else {
                return expenseToSendToAPI;
            }
        })
        //use a POST fetch call to add expense to the database
        .then(expenseToSendToAPI => {
            return fetch(`http://localhost:8088/expenses`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(expenseToSendToAPI)
            })
        })
        //parse the response data as json
        .then(res => res.json())
        //newExpense is data received from json server
        .then((newExpense) => {
            //set global state variable for the updated state
            setExpenses(prevExpenses => [...prevExpenses, newExpense])
            //clear the form fields
            setExpense(({
                budgetId: parseInt(budgetId),
                categoryId: "",
                name: "",
                amount: ""
            }))
            //categories were updated, so use setCategoriesTrigger and add 1, making it truthy
            setCategoriesUpdateTrigger(categoriesUpdateTrigger => categoriesUpdateTrigger + 1)
            //use navigate to navigate back to the budget
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
                <div className="dropdown">
                    <label htmlFor="budget">Category: </label>
                    <select id="category"
                        className="form-control"
                        value={expense.categoryId}
                        onChange={(evt) => {
                            const copy={...expense}
                            copy.categoryId = parseInt(evt.target.value)
                            console.log(copy.categoryId)
                            setExpense(copy)
                        }}>
                            <option value="" disabled>Select a category</option>
                            {category.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
                        </select>
                </div>
            </fieldset>
            <button onClick={(clickEvent) => handleSaveButtonClick(clickEvent)} className="btn btn-success">Save</button>

    </form>
    )
}