import { useEffect, useState } from "react"
import { Budget } from "./Budget"
import { useNavigate } from "react-router-dom"



export const NewBudgetForm = () => {

    const [budget, update] = useState({
        name: "",
        date: "",
        categories: []

    })

    const [checkedItems, setCheckedItems] = useState()

    const navigate = useNavigate()

    const localBudgetUser = localStorage.getItem("budget_user")
    const budgetUserObject = JSON.parse(localBudgetUser)


    const handleSubmitButtonClick = (event) => {
        event.preventDefault()
        
        const budgetToSendToAPI = {
            userId: budgetUserObject.id,
            name: budget.name,
            categoryGroupIds: budget.categories,
            dateCreated: new Date()
        }
        
        return fetch(`http://localhost:8088/budgets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(budgetToSendToAPI)
        })
            .then(res => res.json())
            .then(() => {
                navigate("/mybudgets")
            })
        

    }

    return <>
    <form>
    <fieldset>
    <div>
        <label htmlFor="budgetName">Budget Name</label>
    <input 
    required autoFocus 
    type="text"
    className="form-control"
    palceholder="enter budget name here"
    value={budget.name}
    onChange={
        (evt) => {
            const copy = {...budget}
            copy.name = evt.target.value
            update(copy)
        }
    } />
    </div>
    </fieldset>
    <fieldset>
        <div className="form-group">
            <div onChange={
                (evt) => {
                    const copy = {...budget}
                    if (evt.target.checked) {
                    copy.categories.push(evt.target.value)
                    } 
                    update(copy)
                }
            }>
            <label htmlFor="category group">Choose your starting category groups: </label>
            <p></p>
            <input type="checkbox"name="category_group" value="1"/>Credit Card Payments
            <p></p>
            <input type="checkbox"name="category_group" value="2"/>Bills
            <p></p>
            <input type="checkbox"name="category_group" value="3"/>Frequent Expenses
            <p></p>
            <input type="checkbox"name="category_group" value="4"/>Goals
            <p></p>
            <input type="checkbox"name="category_group" value="5"/>Non-Monthly
            <p></p>
            <input type="checkbox"name="category_group" value="6"/>Quality of Life
            <p></p>
            <input type="checkbox"name="category_group" value="7"/>Weekly Expenses
            <p></p>
            <input type="checkbox"name="category_group" value="8"/>Monthly Expenses
            <p></p>
            <input type="checkbox"name="category_group" value="9"/>Yearly Expenses
            <p></p>
            <input type="checkbox"name="category_group" value="10"/>Vacation
            <p></p>
            <input type="checkbox"name="category_group" value="11"/>Wish List
            <p></p>
            </div>
    </div>
    </fieldset>
    <button onClick = {(clickEvent) => handleSubmitButtonClick(clickEvent)}
    className="btn btn-primary">Start Budgeting!</button>
    
    </form>
    
    </>



}