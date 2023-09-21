import React from 'react'
import { Link } from './Link'
const ImageWithText = () => {
  return (<>
    
    <div className='ImageWithText wrapper flex py-20 flex-wrap items-center bg-[#f7f1f0]'>
        <div className='images pl-9'>

            <div className='overlapping imgs flex flex-row items-center'>
            <div className='whietshoes  z-10'>
                    <img src="https://cdn.shopify.com/s/files/1/0649/9070/7930/files/whiteshoes.jpg?v=1691998213" />  
                </div>
                <div className='orangeshoes transform -translate-x-12 -translate-y-14'>
                    <img src='https://cdn.shopify.com/s/files/1/0649/9070/7930/files/orangeshoes.jpg?v=1691998220' />
                </div>
               
            </div>

        </div>
        <div className='Text'>
            <h2 className='text-[32px]'>Missed the sale ?</h2>
            <p className='text-[18px]'>Shop from the crazy deals</p>
            <Link to="/" className="btn btn--primary">Min 30% OFF </Link>
        </div>

    </div>
    
  </>)
}

export default ImageWithText