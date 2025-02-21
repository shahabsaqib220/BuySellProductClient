import React from 'react'
import Product from './Product'
import CoverImages from "./CoverImages"
import SearchResults from './SearchResults'
import { useSelector } from 'react-redux';


const ProductItemsCard = () => {
  const searchTerm = useSelector((state) => state.search.term);
  return (
    <div>
      {/* Render CoverImages component */}
      <CoverImages />

      {/* Conditional rendering based on the search term */}
      {searchTerm ? (
        // If search term exists, render SearchResults
        <SearchResults />
      ) : (
        // If search term does not exist, render Product
        <Product />
      )}
    </div>
  )
}

export default ProductItemsCard
