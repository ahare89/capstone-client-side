import { Outlet, Route, Routes } from "react-router-dom"
import { Budget } from "../budget/Budget"
import { NewBudgetForm } from "../budget/NewBudgetForm"
import { BudgetList } from "../budget/BudgetList"

export const ApplicationViews = () => {
	return (
        <Routes>
            <Route path="/" element={
                <>
                    <h1>Where'd My Money Go</h1>

                    <Outlet />
                </>
            }>

                <Route path="" element={ <Budget /> } />
				<Route path="create" element={ <NewBudgetForm />  } />
                <Route path="mybudgets" element={ <BudgetList /> } /> 
                <Route path="tickets/:ticketId/edit" element={ <></>  } />
            </Route>
        </Routes>
    )
}