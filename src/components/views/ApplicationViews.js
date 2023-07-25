import { Outlet, Route, Routes } from "react-router-dom"
import { Budget } from "../budget/Budget"
import { NewBudgetForm } from "../budget/NewBudgetForm"
import { BudgetList } from "../budget/BudgetList"
import { CreateExpense } from "../budget/CreateExpense"
import { CurrentBudget } from "../budget/CurrentBudget"

export const ApplicationViews = () => {
	return (
        <Routes>
            <Route path="/" element={
                <>
                    <h1 className="title">Where'd My Money Go</h1>

                    <Outlet />
                </>
            }>

                <Route path="" element={ <Budget /> } />
				<Route path="create" element={ <NewBudgetForm />  } />
                <Route path="mybudgets" element={ <BudgetList /> } /> 
                <Route path="budget/:budgetId/" element={ <CurrentBudget />  } />
            </Route>
        </Routes>
    )
}