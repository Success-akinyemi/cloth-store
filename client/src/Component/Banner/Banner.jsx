import { useEffect, useRef, useState } from 'react';
import './Banner.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Banner({ data }) {
    const [ current, setCurrent ] = useState(0)
    const length = data?.length
    const timeout = useRef(null)

    useEffect(() => {
        const nextSlide = () => {
            setCurrent((current) => (current === length -1 ? 0 : current + 1))
        }
        timeout.current = setTimeout(nextSlide, 3000)

        return function(){
            if(timeout.current){
                clearTimeout(timeout.current)
            }
        }
    }, [current, length])

    const nextSlide = () => {
        if(timeout.current){
            clearTimeout(timeout.current)
        }
        setCurrent((current) => (current === length - 1 ? 0 : current + 1))
    }

    const prevSlide = () => {
        if(timeout.current){
            clearTimeout(timeout.current)
        }
        setCurrent((current) => (current === 0 ? length -1  : current - 1))
    }

    if(!Array.isArray(data) || data.length <= 0){
        return null
    }

  return (
    <div className='banner'>
        {
            data?.map((item, idx) => {
                return (
                    <div key={item?._id} className="bannerImgContainer">
                        {
                            idx === current && (
                                <img className='bannerImg' src={item?.img} alt='banner' />
                            )
                        }
                    </div>
                )
            })
        }
            <div className='dots'>
                {data?.map((_, idx) => (
                    <span
                        key={idx}
                        className={`dot ${idx === current ? 'active' : ''}`}
                    ></span>
                ))}
            </div>
        <div className="bannerBtn">
            <button className='bannerBtn1' onClick={prevSlide}><ArrowBackIcon /></button>
            <button className='bannerBtn2' onClick={nextSlide}><ArrowForwardIcon /></button>
        </div>
    </div>
  )
}

export default Banner