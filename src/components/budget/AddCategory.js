import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AddCategory.css"

export const AddCategory = ({budgetId, setCategories, categories, getAllBudgets, setCategoriesUpdateTrigger}) => {



  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(false)

 

//useEffect to fetch categories state

  useEffect(() => {
    fetch(`http://localhost:8088/categories`)
      .then((res) => res.json())
      .then((categoryArray) => {
        setCategories(categoryArray);
      })
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();


    fetch(`http://localhost:8088/budgets/${budgetId}`)
        .then(res => res.json())
        .then(budgetData => {
            //if budgetData.categories doesn't exist, set it to an empty array
            if(!budgetData.categories) {
                budgetData.categories = []
            }
            //if budgetData.categories does not include a certain category, push the selected category into the array
            if (!budgetData.categories.includes(parseInt(selectedCategory))) {
                budgetData.categories.push(parseInt(selectedCategory));
    
                return fetch(`http://localhost:8088/budgets/${budgetId}`,{
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(budgetData)
                })
                .then(() => {
                    // fetch categories again after successfully adding a new category
                    fetch(`http://localhost:8088/categories`)
                      .then(res => res.json())
                      .then((categoriesData) => {
                        setCategories(categoriesData);
                        //add 1 to categories update trigger to trigger re-render
                        setCategoriesUpdateTrigger(categoriesUpdateTrigger => categoriesUpdateTrigger + 1)
                      });
                  })
            } else {
                //set error to display if the selected category already exists on the budget
                setError("This category already exists in this budget")
            }
        })

  };


  return (
    <div className="addCategoryDropdown">
    <form className="container mt-4" onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <h4>Add Budget Category</h4>
      <label htmlFor="categorySelect"></label>
      <select
        className = "form-control"
        id="categorySelect"
        value={selectedCategory}
        required autoFocus
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="" disabled className="dropdown-item">
          Select a category
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      </div>
    {/* short circuit, if error exists, display error */}
      {error && <p>{error}</p>}
          <div className="form-group">
      <button type="submit" className="btn btn-success">Save</button>
      </div>
    </form>
    </div>
  );
};