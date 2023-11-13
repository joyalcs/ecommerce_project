import React from 'react'
import { Row, Col} from 'react-bootstrap'
import CategoryCard from "./CategoryCard"
import { useGetCategoriesQuery } from '../services/categories/categoryApi'

const Category = () => {

    const { data: categories, isLoading, isSuccess, isError, error } = useGetCategoriesQuery();
    let categoryData;

    if(isLoading){
      categoryData = <p className='text-center'>Loading...</p>
    }

    if(isSuccess){
      categoryData = categories.map(category => (
        <Col key={category.cid} sm={12} md={6} lg={4} xl={3}>
          <CategoryCard category={category}/>
        </Col>
      ))
    }

  return (
    <div className='mt-3'>
      <h1>Categories</h1>
      <Row>
          {categoryData}
      </Row>
    </div>
  )
}

export default Category
