import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { CreateExpense } from "./CreateExpense"
import { useEffect, useState } from "react"

export const CurrentBudget = () => {

    const [isCreatingExpense, setIsCreatingExpense] = useState(false)

    const {budgetId} = useParams()
    const [budget, update] = useState({})
    const [expenses, setExpenses] = useState([])
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`http://localhost:8088/budgets?id=${budgetId}`)
        .then(res => res.json())
        .then(data => {
            const singleBudget = data[0]
            update(singleBudget)
    
            fetch(`http://localhost:8088/expenses`)
            .then(res => res.json())
            .then(data => {
                const expenseData = Array.isArray(data) ? data : [data]
                const budgetExpenses = expenseData.filter(expense => expense.budgetId === singleBudget.id)
                setExpenses(budgetExpenses)
            })
        })
    }, [budgetId])

    useEffect(() => {
        fetch(`http://localhost:8088/categories`)
        .then(res => res.json())
        .then(
            (data) => {
                setCategories(data)
        })
    }, [])


    useEffect(() => {
        console.log('Expenses updated:', expenses)
    }, [expenses])

    const handleCreateExpenseButton = () => {
        setIsCreatingExpense(true)
    }

    return (
        <>        
                <div>
                <h2>{budget.name}</h2>
                <h4>Current Expenses</h4>
                </div>
                {
    budget.categories && budget.categories.map(categoryId => {
        const category = categories.find(cat => cat.id === categoryId);
        return (
            <div key={categoryId}>
                <h5>{category?.name}</h5>
                {
                    expenses.filter(expense => expense.categoryId === categoryId)
                    .map(expense => (
                        <p key={expense.id}>
                            {expense.name} ${expense.amount}
                        </p>
                    ))
                }
            </div>
        )
    })
}
            <div>
            <button onClick={handleCreateExpenseButton}>Create Expense</button>
            {isCreatingExpense && <CreateExpense budgetId={budgetId}/>}
             </div>
            <div>
                <button>Add Category</button>
                </div>    

            <div>
                <h2>Here's how you're doing:</h2>
            </div>


             </>

  )      
}