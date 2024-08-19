import './Categories.css'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from 'react';
import Spinner from '../../Admin/Component/Spinner/Spinner';

function Categories({data, isLoadingCat}) {
  const [ slideIndex, setSlideIndex ] = useState(0)
  const lastItem = data?.length - 1
  console.log(lastItem)

  const handleDirection = (direction) => {
    if(direction === 'left'){
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : lastItem)
    } else {
      setSlideIndex(slideIndex < lastItem ? slideIndex + 1 : 0 )
    }
  }

  var settings = {
    speed: 500,
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {      
        breakpoint: 950,
        settings: {
          dots: true,
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          pauseOnHover: true,
        } 
      },
      {      
        breakpoint: 450,
        settings: {
          dots: true,
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          pauseOnHover: true,
        } 
      },
    ]
  }

  return (
    <div className='categories'>
        <div className="tag">Our Categories</div>
        <div className="content">
          <div className="body">
            <Slider {...settings}>
            {
              isLoadingCat ? (
                <Spinner />
              ) 
                : 
              (
                data?.map((item, idx) => (
                  <div key={idx} className='card' >
                    <img className='img' src={item?.img} alt={`${item?.name}`} />
                    <Link className='link btn' to={`/store/${item?.cat}`}>
                      Explore
                    </Link>
                    <p className='name'>{item?.name}</p>
                  </div>
                ))
              )
            }
            </Slider>
            {
              /**
               <div className="buttons">
                 <button className="btn1" onClick={() => handleDirection('left')} >
                   <ArrowBackIcon />
                 </button>
                 <button className="btn2" onClick={() => handleDirection('right')} >
                   <ArrowForwardIcon />
                 </button>
               </div>
               * 
               */
            }
          </div>
        </div>
    </div>
  )
}

export default Categories