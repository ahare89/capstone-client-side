import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    <form className="dropdown" onSubmit={handleSubmit}>
      <label htmlFor="categorySelect">Select Category: </label>
      <select
        id="categorySelect"
        value={selectedCategory}
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
    {/* short circuit, if error exists, display error */}
      {error && <p>{error}</p>}

      <button type="submit" className="btn btn-success">Save</button>
    </form>
  );
};
