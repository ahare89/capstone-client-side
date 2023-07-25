import { useEffect, useState } from "react"

export const BudgetItems = () => {
    
const [categories, setCategories] = useState([])

const [expenses, setExpenses] = useState()

useEffect(
    () => {
        fetch(`http://localhost:8088/categories`)
        .then(res => res.json())
        .then(
            (categoryArray) => {
                setCategories(categoryArray)
            }
        )
    },
    []
)

useEffect(
    () => {
        fetch(`http://localhost:8088/`)
    }
)

}