import React, { useEffect, useState } from "react";
import { Budget } from "./Budget";
import { useNavigate } from "react-router-dom";
import "./NewBudgetForm.css"

export const NewBudgetForm = () => {
  const [budget, update] = useState({
    name: "",
    date: "",
    categories: [],
  });

  const [categoryChecklist, setCategoryChecklist] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false)
  const [categories, setCategories] = useState([]);

//useEffect to fetch categories from database

  useEffect(() => {
    fetch("http://localhost:8088/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
        //set initial checklist to an empty object
        let initialChecklist = {};
        //loop over each category, setting each category to false
        data.forEach((category) => {
          initialChecklist[category.id] = false;
        });
        setCategoryChecklist(initialChecklist);
      });
  }, []);

  //create variable to hold array of categories that are selected (true)
  const selectedCategories = Object.keys(categoryChecklist).filter((categoryId) => categoryChecklist[categoryId]);


//create useEffect to watch for changes to categoryChecklist state, update budget state with categories that have been selected

  useEffect(() => {
    const selectedCategoryIds = selectedCategories.map(categoryId => parseInt(categoryId))
    update((prevBudget) => ({ ...prevBudget, categories: selectedCategoryIds }));
  }, [categoryChecklist]);

  const handleCheckAllClick = () => {
    
    const updatedChecklist = {...categoryChecklist}

    Object.keys(updatedChecklist).forEach((categoryId) => {
        updatedChecklist[categoryId] = !isAllChecked
    })
    setCategoryChecklist(updatedChecklist)
    setIsAllChecked(!isAllChecked)
  }

  //create click handler
  const handleCategoryCheckboxClick = (categoryId) => {
    setCategoryChecklist((prevChecklist) => ({
      ...prevChecklist,
      //if button is clicked change value of key to whatever is opposite of current value, (true/false)
      [categoryId]: !prevChecklist[categoryId],
    }))
  }

  const navigate = useNavigate();

  const localBudgetUser = localStorage.getItem("budget_user");
  const budgetUserObject = JSON.parse(localBudgetUser);

  const handleSubmitButtonClick = (event) => {
    event.preventDefault();

    const budgetToSendToAPI = {
      userId: budgetUserObject.id,
      name: budget.name,
      categories: budget.categories,
      dateCreated: new Date(),
    };

    return fetch(`http://localhost:8088/budgets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetToSendToAPI),
    })
      .then((res) => res.json())
      .then((newBudget) => {
        console.log(newBudget)
        navigate(`/budget/${newBudget.id}`)
      });
  };

  return (
    <>
      <form className="container-fluid">
        <fieldset className="mb-3">
          <div className="form-check">
            <label htmlFor="budgetName">Budget Name</label>
            <input
              required
              autoFocus
              type="text"
              className="form-control"
              palceholder="enter budget name here"
              value={budget.name}
              onChange={(evt) => {
                update((prevBudget) => ({
                  ...prevBudget,
                  name: evt.target.value,
                }));
              }}
            />
          </div>
        </fieldset>
        <fieldset>
          <div className="form-check">
            <label htmlFor="categorygroup" className="form-check-label">
              Choose your starting categories:{" "}
            </label>
            <p></p>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <input
                  className="form-check-input" type="checkbox" id="flexCheckDefault"
                  name="category_group"
                  value={category.id}
                  checked={categoryChecklist[category.id] || isAllChecked}
                  onChange={() => handleCategoryCheckboxClick(category.id)}
                />
                {category.name}
                <p></p>
              </React.Fragment>
            ))}
          </div>
        </fieldset>
        <button type="button" className="btn btn-info" onClick={handleCheckAllClick}>
                {isAllChecked ? "Uncheck All" : "Check All"}
            </button>
        <button
          onClick={(clickEvent) => handleSubmitButtonClick(clickEvent)}
          className="btn btn-primary"
        >
          Start Budgeting!
        </button>
      </form>
    </>
  );
  
};
