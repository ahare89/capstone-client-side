import React, { useEffect, useState } from "react";
import { Budget } from "./Budget";
import { useNavigate } from "react-router-dom";

export const NewBudgetForm = () => {
  const [budget, update] = useState({
    name: "",
    date: "",
    categories: [],
  });

  const [categoryChecklist, setCategoryChecklist] = useState({});

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8088/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
        let initialChecklist = {};
        data.forEach((category) => {
          initialChecklist[category.id] = false;
        });
        setCategoryChecklist(initialChecklist);
      });
  }, []);

  const selectedCategories = Object.keys(categoryChecklist).filter((categoryId) => categoryChecklist[categoryId]);

  useEffect(() => {
    const selectedCategoryIds = selectedCategories.map(categoryId => parseInt(categoryId))
    update((prevBudget) => ({ ...prevBudget, categories: selectedCategoryIds }));
  }, [categoryChecklist]);

  const handleCategoryCheckboxClick = (categoryId) => {
    setCategoryChecklist((prevChecklist) => ({
      ...prevChecklist,
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
      .then(() => {
        navigate("/mybudgets");
      });
  };

  return (
    <>
      <form>
        <fieldset>
          <div>
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
          <div className="form-group">
            <label htmlFor="category group">
              Choose your starting categories:{" "}
            </label>
            <p></p>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <input
                  type="checkbox"
                  name="category_group"
                  value={category.id}
                  checked={categoryChecklist[category.id]}
                  onChange={() => handleCategoryCheckboxClick(category.id)}
                />
                {category.name}
                <p></p>
              </React.Fragment>
            ))}
          </div>
        </fieldset>
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
