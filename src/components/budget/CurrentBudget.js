import { useNavigate, useParams } from "react-router-dom";
import { CreateExpense } from "./CreateExpense";
import { useEffect, useState } from "react";
import { AddCategory } from "./AddCategory";
import "./CurrentBudget.css";
import { PieChart } from "./PieChart";
import { EditExpense } from "./EditExpense";

export const CurrentBudget = ({
  budget,
  setBudget,
  expenseState,
  setExpenses,
  categories,
  setCategories,
  income,
  setIncome,
  incomeChangeTrigger,
}) => {
  const [isCreatingExpense, setIsCreatingExpense] = useState(false);

  const { budgetId } = useParams()
  const navigate = useNavigate()
  const [budgetIncome, setBudgetIncome] = useState(0)
  const [chartData, setChartData] = useState({ labels: [], data: [] })
  const [showChart, setShowChart] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentExpense, setCurrentExpense] = useState(null)
  const [currentlyEditingExpenseId, setCurrentlyEditingExpenseId] = useState(null)

  //useEffect to fetch an individual budgets data and the expenses for that budget.  observes state change for budgetId from useParams
  useEffect(() => {
    fetch(`http://localhost:8088/budgets?id=${budgetId}`)
      .then((res) => res.json())
      .then((data) => {
        const singleBudget = data[0];
        setBudget(singleBudget);

        fetch(`http://localhost:8088/expenses`)
          .then((res) => res.json())
          .then((data) => {
            const expenseData = Array.isArray(data) ? data : [data];
            const budgetExpenses = expenseData.filter(
              (expense) => expense.budgetId === singleBudget?.id
            );
            setExpenses(budgetExpenses);
          });
      });
  }, [budgetId]);

  //useEffect to fetch categories from the database

  useEffect(() => {
    fetch(`http://localhost:8088/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("failed to fetch categories:", error);
      });
  }, []);

  //useEffect to udpate the data used for the chart whenever expenses or categories change

  useEffect(() => {
    const data = getChartData();
    setChartData(data);
  }, [expenseState, categories]);

  //useEffect that watches for changes in income and re-renders app if income is added

  useEffect(() => {
    fetch(`http://localhost:8088/income`)
      .then((res) => res.json())
      .then((incomeData) => {
        setIncome(incomeData);
      });
  }, [incomeChangeTrigger]);

  //create function to get data for pie chart

  const getChartData = () => {
    //create empty array variables for labels (expense categories) and data (expense amount)
    let labels = [];
    let data = [];

    //iterate over each expense to find out if expense category Id matches the category Id from the categories array
    expenseState.forEach((expense) => {
      const category = categories.find((cat) => cat.id === expense.categoryId);
      //if corresponding category is found --
      if (category) {
        //--create variable for index, searches labels array and finds the first occurrence of category.name
        const index = labels.indexOf(category.name);
        //if category.name does not exist in labels array, push the category name into the array and the amount of the expense
        if (index === -1) {
          labels.push(category.name);
          data.push(expense.amount);
          //if the category name already exists in the labels array, add the expense amount to the category
        } else {
          data[index] += expense.amount;
        }
      }
    });

    return { labels, data };
  };

  useEffect(() => {
    //create totalIncome variable with 0 value to start
    let totalIncome = 0;
    //create an incomeArray variable, if income is already an array, that's the value, if not it creates a new array from income for the value
    const incomeArray = Array.isArray(income) ? income : [income];
    //iterate through income array and add the amount to totalIncome
    for (let i = 0; i < incomeArray.length; i++) {
      let inc = incomeArray[i];
      // check if income exists and if budgetId from useParams is equal to the income budgetId property
      if (inc && +budgetId === inc.budgetId) {
        totalIncome = totalIncome + inc.amount;
      }
    }
    //create totalExpense variable with a value of 0 to start
    let totalExpense = 0;
    //create expenseArray variable for the expenseState that makes expenseState an array if it's not already
    const expenseArray = Array.isArray(expenseState)
      ? expenseState
      : [expenseState];

    //loop through expenses array, if an expense exists and the budgetId from useParams is equal to the budgetId from the expense, add that amount to the total expenses
    for (let i = 0; i < expenseArray.length; i++) {
      let exp = expenseArray[i];
      if (exp && +budgetId === exp.budgetId) {
        totalExpense += exp.amount;
      }
    }

    setBudgetIncome(totalIncome - totalExpense); // update budgetIncome state variable
  }, [income, budgetId, expenseState]); // recalculate when income or budgetId changes

  //function to format numbers into currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  //create handler for the create expense button

  const handleCreateExpenseButton = () => {
    setIsCreatingExpense(true);
  };

//create handler for delete expense button

  const handleDeleteExpense = (expenseId) => {
    fetch(`http://localhost:8088/expenses/${expenseId}`, {
      method: "DELETE",
    })
      .then(() => {
        //update state variable to only the expenses that don't match the deleted expense
        setExpenses(expenseState.filter((expense) => expense.id !== expenseId));
      })
      .catch((error) => console.error("Error:", error));
  };

//create function for deleting a category

  const DeleteCategory = async (categoryId, budgetId) => {
    try {
      // Fetch the current budget
      const response = await fetch(`http://localhost:8088/budgets/${budgetId}`);
      const currentBudget = await response.json();

      // Filter out the category to be deleted
      const updatedCategories = currentBudget.categories.filter(
        //for each category, filter ones that don't match the categoryId
        (category) => category !== categoryId
      )

      // Update the budget with the new list of categories, minus the one that matched
      currentBudget.categories = updatedCategories;

      // Send the updated budget back to the server
      const updateResponse = await fetch(
        `http://localhost:8088/budgets/${budgetId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentBudget),
        }
      );

      // Update the UI
      const updatedBudget = await updateResponse.json();

      // Update the state
      setBudget(updatedBudget);
    } catch (error) {
      console.error(error);
      alert(
        "An error occurred while trying to remove the category from the budget"
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    await DeleteCategory(categoryId, budgetId);
  };
  


  const chartColors = [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#34495e",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#ecf0f1",
    "#95a5a6",
    "#f39c12",
    "#d35400",
    "#c0392b",
    '#F1E9DB',
    '#F7FFF7'
  ];

  

  return (
    <>
      <div className="incomeHeader">
      <h3>
    Money Left To Budget:
    <span style={{ color: budgetIncome < 0 ? 'red' : 'green' }}>
      {formatCurrency(budgetIncome)}
    </span>
  </h3>
      </div>
      <div>
        <h4 className="budget_name">{budget?.name}</h4>
      </div>
      <div className="container-fluid">
        <PieChart chartData={chartData} chartColors={chartColors}/>
      </div>
      {/* ifEditing is truthy, render the EditExpense component */}
      {isEditing ? <EditExpense expenseId={currentExpense.id} setIsEditing={setIsEditing} setExpenses={setExpenses}/> : null}
      {budget?.categories &&
      //if budget exists and has categories, use map to iterate through category ids from the budget
        budget?.categories.map((categoryId) => {
            //for each category Id, find the ones that match the budget category Ids
          const category = categories?.find((cat) => cat?.id === categoryId)

          return (
            <div key={categoryId} className="container-fluid">
              <div className="category-container">
              <h5 className="fs-2 category-name">{category?.name}</h5>
              <button className="btn btn-warning btn-sm" id="liveAlertBtn" onClick={() => handleDeleteCategory(categoryId)}>
                <i className="fa fa-trash"></i>
              </button>
              </div>
              <div id="liveAlertPlaceholder"></div>
              {expenseState
                ?.filter(
                  (expenseState) => expenseState?.categoryId === categoryId
                )
                .map((expenseState) => (
                  <div key={expenseState?.id} className="fs-5">
                    {expenseState?.name} 
                    <div className="amount">${expenseState?.amount}
                    <button className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteExpense(expenseState.id)}
                    >
                        <i className="fa fa-trash"></i>
                      
                    </button>
                    <button className="btn btn-primary btn-sm"
                      onClick={() => {
                        setCurrentExpense(expenseState);
                        setCurrentlyEditingExpenseId(expenseState.id);
                      }}
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                    </div>

                    {currentlyEditingExpenseId === expenseState.id && (
                  <EditExpense 
                    expenseId={expenseState.id} 
                    setIsEditing={() => setCurrentlyEditingExpenseId(null)} 
                    setExpenses={setExpenses}
                  />
                )}
                
                  </div>
                ))}
            </div>
          );
        })}
    </>
  );
};
