import React from 'react'
import {AiFillStar, AiOutlineStar} from "react-icons/ai"
import {FaStarHalfAlt} from "react-icons/fa"

const Rating = ({value, text, color}) => {
  return (
    <div>
        <span>
            <i>
                {value >= 1 ? (
                    <AiFillStar />
                ) : value >= 0.5 ? (
                    <FaStarHalfAlt />
                ) : (
                    <AiOutlineStar />
                )}
            </i>
        </span>
        <span>
            <i>
                {value >= 2 ? (
                    <AiFillStar />
                ) : value >= 1.5 ? (
                    <FaStarHalfAlt />
                ) : (
                    <AiOutlineStar />
                )}
            </i>
        </span>
        <span>
            <i>
                {value >= 3 ? (
                    <AiFillStar />
                ) : value >= 2.5 ? (
                    <FaStarHalfAlt />
                ) : (
                    <AiOutlineStar />
                )}
            </i>
        </span>
        <span>
            <i>
                {value >= 4 ? (
                    <AiFillStar />
                ) : value >= 3.5 ? (
                    <FaStarHalfAlt />
                ) : (
                    <AiOutlineStar />
                )}
            </i>
        </span>
        <span>
            <i>
                {value >= 5 ? (
                    <AiFillStar />
                ) : value >= 4.5 ? (
                    <FaStarHalfAlt />
                ) : (
                    <AiOutlineStar />
                )}
            </i>
        </span>

        <span>{ text && text}</span>
    </div>
  )
}

export default Rating
