import { useEffect, useState } from "react"
import "./Budget.css"
import { Link, useNavigate } from "react-router-dom"
import { DeleteBudget } from "./DeleteBudget"
import { NewBudgetForm } from "./NewBudgetForm"

export const BudgetList = () => {

    const localBudgetUser = localStorage.getItem("budget_user")
    const budgetUserObject = JSON.parse(localBudgetUser)
    
    const [budget, setBudget] = useState([])

    const [filteredBudgets, setFiltered] = useState([])

    const navigate = useNavigate()

    const getAllBudgets = () => {
        fetch(`http://localhost:8088/budgets`)
        .then(res => res.json())
        .then(
            (budgetArray) => {
                setBudget(budgetArray)
            }
        )
    }

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
            if (budgetUserObject.id !== null) {
            const myBudgets = budget.filter(budget => budget.userId === budgetUserObject.id)
                setFiltered(myBudgets)
        }   else {
            setFiltered(budget)
        }
    },
        [budget]
    ) 
    
    if (filteredBudgets.length <= 0) {
    return <button className="btn btn-primary" onClick={ () => { navigate("/create")}}>Create New Budget</button>
    }
    
    return <>
        <h3>My Budgets</h3>
        <article className="budgets">
        {
        filteredBudgets.map(
            (budget) => {
                    return <section className="budget" key={budget.id}>
                    <header className="header"><Link to = {`/budget/${budget.id}`}>{budget.name}</Link></header>
                    <div><DeleteBudget id={budget.id} getAllBudgets={getAllBudgets}/></div>
                    
                    </section>
            }
        )
        }   
       
        </article>
    </>

}