import { useEffect, useState } from "react"
import "./Budget.css"
import { Link } from "react-router-dom"
import { EditBudget } from "./EditBudget"
import { DeleteBudget } from "./DeleteBudget"

export const BudgetList = () => {

    const localBudgetUser = localStorage.getItem("budget_user")
    const budgetUserObject = JSON.parse(localBudgetUser)
    
    const [budget, setBudget] = useState([])

    const [filteredBudgets, setFiltered] = useState([])

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
        
    return <>
        <h3>My Budgets</h3>
        <article className="budgets">
        {
        filteredBudgets.map(
            (budget) => {
                    return <section className="budget" key={budget.id}>
                    <header className="header"><Link to = {`/budget/${budget.id}`}>{budget.name}</Link></header>
                    <div><EditBudget/></div>
                    <div><DeleteBudget id={budget.id} getAllBudgets={getAllBudgets}/></div>
                    </section>
            }
        )
        }   
       
        </article>
    </>

}