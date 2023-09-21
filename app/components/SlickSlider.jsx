import React, { Component } from "react";
import Slider from "react-slick";
import { Image } from "@shopify/hydrogen";
// import "../../dist/client/build/campus1.jpg"
const sliderImages =[
{
  "index":1,
  "src":"https://cdn.shopify.com/s/files/1/0649/9070/7930/files/campus1.jpg?v=1689848893"
},
{
  "index":2,
  "src":"https://cdn.shopify.com/s/files/1/0649/9070/7930/files/campus2.jpg?v=1689848894"
},
{
  "index":3,
  "src":"https://cdn.shopify.com/s/files/1/0649/9070/7930/files/campus3.jpg?v=1689848893"
},
{
  "index":4,
  "src":"https://cdn.shopify.com/s/files/1/0649/9070/7930/files/campus4.jpg?v=1689848893"
},{
  "index":5,
  "src":"https://cdn.shopify.com/s/files/1/0649/9070/7930/files/campus5.jpg?v=1689848894"
}



]
const SlickSlider = () => {
  
    var settings = {
        dots: false,
        arrows:true,
        prevArrow:<button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><title>Left</title><polyline points="15 18 9 12 15 6"></polyline></svg></button>,
        nextArrow: <button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><title>Right</title><polyline points="9 18 15 12 9 6"></polyline></svg></button>,
        infinite: true,
        slidesToScroll: 1,
        autoplay: true,
      speed: 2000,
      autoplaySpeed: 5000
        
      };
      return (
        <div>
       
        <Slider {...settings}>
     
       {
      sliderImages.map((i) =>{       
          return(<div key={i.index}>          
           <Image src={i.src}/>
          
           </div>)
      })

       } 
      
        </Slider>
      </div>
      );
  
}

export default SlickSlider

