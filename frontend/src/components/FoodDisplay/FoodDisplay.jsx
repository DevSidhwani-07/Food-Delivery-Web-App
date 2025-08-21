import React, { useContext } from 'react'
import './FoodDisplay.css'
import { Storecontext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(Storecontext)


  // Function to capitalize the first letter
  const capitalize = (text) => {
    if (!text) return ""
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }


  const selectedCategory = capitalize(category)

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>

       {/* Food items list */}
      <div className="food-display-list">
        {food_list.map((item, index) => {

           // Show item only if category matches OR "All" is selected
          if (selectedCategory === "All" || selectedCategory === capitalize(item.category)) {
            return <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              category={item.category}
            />
          }
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
