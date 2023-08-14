import { useEffect, useState } from "react"

export const EditExpense = ({expenseId, setIsEditing, isEditing, setExpenses}) => {

    const [expense, setExpense] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(expenseId){
            fetch(`http://localhost:8088/expenses/${expenseId}`)
                .then(res => res.json())
                .then((data) => {
                    setExpense(data);
                    setLoading(false);
                })
        }
    }, [expenseId]);

    const handleCancelButtonClick = () => {
        setIsEditing(false);
    }

    const handleSaveButtonClick = (event) => {
        event.preventDefault()

        fetch(`http://localhost:8088/expenses/${expenseId}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(expense)
        })
        .then(res => res.json())
        .then(updatedExpense => {
            setExpenses(prevExpenses =>
                //use map to iterate over the expenses, if updatedExpense.id matches an expense.id, replace that expense with the updated version, otherwise, leave it the same 
              prevExpenses.map(expense =>
                expense.id === updatedExpense.id ? updatedExpense : expense
              )
            );
            setIsEditing(false);
          })
          .catch(error => console.error("Error:", error));
  };

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <div className="container mt-5">
        <form className="expenseForm">
            <h2 className="expenseForm__title mb-4">Edit Expense</h2>
            <fieldset className="mb-3">
                <div className="form-group">
                    <label htmlFor="description">Name:</label>
                    <div className="input-group">
                    <input
                        required autoFocus
                        type="text"
                        className="form-control"
                        placeholder={expense.name}
                        value={expense.name}
                        onChange={
                            (evt) => {
                                const copy = {...expense}
                                copy.name = evt.target.value
                                setExpense(copy)
                            }
                        } />
                </div>
                </div>
            </fieldset>
            <fieldset className="mb-3">
                <div className="form-group">
                    <label htmlFor="name">Amount:</label>
                    <div className="input-group">
                    <input type="number"
                        className="form=control"
                        value={expense.amount}
                        onChange={
                            (evt) => {
                                const copy = {...expense}
                                copy.amount = parseFloat(evt.target.value)
                                setExpense(copy)
                            }
                        } />
                </div>
                </div>
            </fieldset>
            <div className="d-flex justify-content-between">
            <button 
                onClick={(clickEvent) => handleSaveButtonClick(clickEvent)}
                className="btn btn-primary mr-2">
                Save
            </button>
            </div>
            <button type="button" onClick={handleCancelButtonClick} className="btn btn-secondary">Cancel</button>
        </form>
        </div>
    )
}