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
            <input type="checkbox"name="category_group" value="Credit Card Payments"/>Credit Card Payments
            <p></p>
            <input type="checkbox"name="category_group" value="Utility Bill"/>Utility Bill
            <p></p>
            <input type="checkbox"name="category_group" value="Gas"/>Gas
            <p></p>
            <input type="checkbox"name="category_group" value="Vacation"/>Vacation
            <p></p>
            <input type="checkbox"name="category_group" value="Rent/Mortgage"/>Rent/Mortgage
            <p></p>
            <input type="checkbox"name="category_group" value="Dining onSubmit"/>Dining onSubmit
            <p></p>
            <input type="checkbox"name="category_group" value="Clothing"/>Clothing
            <p></p>
            <input type="checkbox"name="category_group" value="Household Goods"/>Household Goods
            <p></p>
            <input type="checkbox"name="category_group" value="Auto Insurance"/>Auto Insurance
            <p></p>
            <input type="checkbox"name="category_group" value="Phone Bill"/>Phone Bill
            <p></p>
            <input type="checkbox"name="category_group" value="Fun"/>Fun
            <p></p>
            <input type="checkbox"name="category_group" value="Miscellaneous"/>Miscellaneous
            </div>
    </div>
    </fieldset>
    <button onClick = {(clickEvent) => handleSubmitButtonClick(clickEvent)}
    className="btn btn-primary">Start Budgeting!</button>
    
    </form>
    
    </>



}