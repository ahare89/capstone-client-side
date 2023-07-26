import React, { useEffect, useState } from "react"

export const AddCategory = () => {

const [category, updateCategory] = useState()

useEffect(() => {
    fetch(`http://localhost:8088/categories`)
    .then(res => res.json())
    .then(
        (categoryArray) => {
            updateCategory(categoryArray)
        }
    )
})


return <React.Fragment key={category}>
                  <input
                    type="select"
                    name="category_group"
                    value={category}
                    checked={categoryChecklist[category]}
                    onChange={(evt) => {
                        update((category) => ({
                            ...prevBudget,
                            name: evt.target.value
                        }))
                    
                    }
        <React.Fragment/> 
}
