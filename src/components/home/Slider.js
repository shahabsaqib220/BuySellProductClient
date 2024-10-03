import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {products} from "./productdata"
import Divider from '@mui/material/Divider';
import "./slide.css"

const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

const Slider = ({title}) => {
  return (
    <div className="products_section bg-white p-8 rounded-xl shadow-2xl">
      <div className="products_deal flex justify-between items-center mb-4">
      <h3 className="text-3xl  text-gray-900 font-roboto">
  {title}
</h3>
        <button className="view_btn bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out text-lg shadow-lg font-semibold transform hover:scale-105">
          View All
        </button>
      </div>
      <Divider className="my-6" />
      <Carousel responsive={responsive} infinite={true} draggable={false} swipeable={true} showDots={false} centerMode={true} autoPlay={false} keyBoardControl={true} removeArrowOnDeviceType={["tablet", "mobile"]} dotListClass='custome-dot-list-style' itemClass='carousel-item-padding-40-px' containerClass="carousel-container">
        {
          products.map((e) => {
            return (
              <div className='products_items'>
                <div className='product_img'>
                  <img src={e.url} alt='Product Photo' />
                </div>
                <p className='products_name font-semibold'>{e.title.shortTitle}</p>
                <p className='products_offer'>{e.discount}</p>
                <p className='products_explore'>{e.tagline}</p>
              </div>
            )
          })
        }

          




      </Carousel>
    </div>
  )
}

export default Slider
