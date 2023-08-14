import { useNavigate, useParams } from "react-router-dom"
import "./Budget.css"
import { useEffect, useState } from "react"
import { CurrentBudget } from "./CurrentBudget"
import { CreateExpense } from "./CreateExpense"
import { AddCategory } from "./AddCategory"
import { CreateIncome } from "./CreateIncome"


export const Budget = () => {

    const {budgetId} = useParams()
    const [categories, setCategories] = useState([])
    const [budget, setBudget] = useState({})
    const [income, setIncome] = useState([])
    const [expenses, setExpenses] = useState([])
    const [showCreateExpense, setShowCreateExpense] = useState(false)
    const [showAddCategory, setShowAddCategory] = useState(false)
    const [showCreateIncome, setShowCreateIncome] = useState(false)
    const [incomeChangeTrigger, setIncomeChangeTrigger] = useState(0)
    const [categoriesUpdateTrigger, setCategoriesUpdateTrigger] = useState(0)
    

//useEffect that oberves for changes in budgetId or a categories update

    useEffect(() => {
        fetch(`http://localhost:8088/budgets/${budgetId}`)
        .then(res => res.json())
        .then((updatedBudget) => {
          setBudget(updatedBudget)
        });
      }, [budgetId, categoriesUpdateTrigger]);

    const navigate = useNavigate()
    return <>
        <CurrentBudget budget={budget} setBudget={setBudget} expenseState = {expenses} setExpenses={setExpenses} categories ={categories} 
        setCategories={setCategories} income={income} setIncome={setIncome} incomeChangeTrigger={incomeChangeTrigger} 
        onIncomeChange={() => setIncomeChangeTrigger(incomeChangeTrigger + 1)} />
        { showCreateExpense && <CreateExpense setCategoriesUpdateTrigger={setCategoriesUpdateTrigger} expenseState={expenses} setExpenses={setExpenses}  budgetId={budgetId} budget={budget} setBudget={setBudget}/> }
        <button className="btn btn-primary budget-margin-bottom" onClick={() => setShowCreateExpense(!showCreateExpense)}>
          { showCreateExpense ? 'Cancel' : 'Create New Expense' }
        </button>
        { showAddCategory && <AddCategory budgetId={budgetId} setCategoriesUpdateTrigger={setCategoriesUpdateTrigger} setCategories={setCategories} categories={categories}/>}
        <button className="btn btn-primary budget-margin-bottom" onClick ={() => setShowAddCategory(!showAddCategory)}>
        { showAddCategory ? 'Cancel' : 'Add Budget Category'}
        </button>
        {
            //short circuit, if showCreateIncome is truthy, render the CreateIncome component
        }
        { showCreateIncome && <CreateIncome budgetId = {budgetId} onIncomeAdded={()=> setIncomeChangeTrigger(incomeChangeTrigger + 1)}/>}
        <button className="btn btn-primary budget-margin-bottom" onClick={() => setShowCreateIncome(!showCreateIncome)}>
        { showCreateIncome ? 'Cancel': 'Add Income'}
        </button>
        
    </>
}