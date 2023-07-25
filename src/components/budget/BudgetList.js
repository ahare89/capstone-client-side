import { useEffect, useState } from "react"
import "./Budget.css"
import { Link } from "react-router-dom"
import { EditBudget } from "./EditBudget"
import { DeleteBudget } from "./DeleteBudget"

export const BudgetList = () => {
    
    const [budget, setBudget] = useState([])

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

    return <>
        <h3>My Budgets</h3>
        <article className="budgets">
        {
        budget.map(
            (budget) => {
                    return <section className="budget" key={budget.id}>
                    <header className="header"><Link to = {`/budgets`}>{budget.name}</Link></header>
                    <div><EditBudget/></div>
                    <div><DeleteBudget id={budget.id} getAllBudgets={getAllBudgets}/></div>
                    </section>
            }
        )
        }   
       
        </article>
    </>

}