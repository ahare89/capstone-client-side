import { Outlet, Route, Routes } from "react-router-dom"
import { Budget } from "../budget/Budget"
import { NewBudgetForm } from "../budget/NewBudgetForm"
import { BudgetList } from "../budget/BudgetList"
import { CreateExpense } from "../budget/CreateExpense"
import { CurrentBudget } from "../budget/CurrentBudget"
import { BudgetHome } from "../budget/BudgetHome"
import "../budget/Budget.css"

export const ApplicationViews = () => {
	return (
        <Routes>
            <Route path="/" element={
                <>
                    <Outlet />
                </>
            }>
                
                <Route path="" element={ <BudgetHome /> } />
				<Route path="create" element={ <NewBudgetForm />  } />
                <Route path="mybudgets" element={ <BudgetList /> } /> 
                <Route path="budget/:budgetId/" element={ <Budget />  } />
            </Route>
        </Routes>
    )
}