import { useEffect, useState } from "react"
import "./Budget.css"
import { Link, useNavigate } from "react-router-dom"
import { DeleteBudget } from "./DeleteBudget"
import { NewBudgetForm } from "./NewBudgetForm"
import "./BudgetList.css"

export const BudgetList = () => {

    const localBudgetUser = localStorage.getItem("budget_user")
    const budgetUserObject = JSON.parse(localBudgetUser)
    
    const [budget, setBudget] = useState([])

    const [filteredBudgets, setFiltered] = useState([])

    const navigate = useNavigate()


    //function that will alllow me to fetch all budgets and assign them to the budget state variable
    const getAllBudgets = () => {
        fetch(`http://localhost:8088/budgets`)
        .then(res => res.json())
        .then(
            (budgetArray) => {
                setBudget(budgetArray)
            }
        )
    }

    //useEffect that fetches all budgets, dependency array is an empty array.  only called when page renders
    useEffect(
        () => {
            fetch(`http://localhost:8088/budgets`)
            .then(res => res.json())
            .then(
                (budgetArray) => {
                    setBudget(budgetArray)
                }
            )
        },
        []
    )

    useEffect(
        () => {
            //if the current logged in user's Id is not null--
            if (budgetUserObject.id !== null) {
                //--set myBudgets variable, the value will be the budgets that have a budgetId equal to the logged in user's Id
            const myBudgets = budget.filter(budget => budget.userId === budgetUserObject.id)
                setFiltered(myBudgets)
        }   else {
            setFiltered(budget)
        }
    },
        [budget]
    ) 
    //if the length of the filtered budgets is <= 0, then show the create new budget button
    if (filteredBudgets.length <= 0) {
    return <button className="btn btn-primary" onClick={ () => { navigate("/create")}}>Create New Budget</button>
    }
    
    return <>
        <h3 className="title">My Budgets</h3>
        <article className="budgets container-fluid">
        {
        filteredBudgets.map(
            (budget) => {
                    return <section className="budget" key={budget.id}>
                    <header className="header"><Link to = {`/budget/${budget.id}`} className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" href="#">{budget.name}</Link></header>
                    <div><DeleteBudget id={budget.id} getAllBudgets={getAllBudgets}/></div>
                    
                    </section>
                    
            }
            
        )
        
        }   
       
        </article>
        <div className="createBudgetButton">
        <button className="btn btn-primary" onClick={ () => { navigate("/create")}}>Create New Budget</button>
        </div>
    </>

}