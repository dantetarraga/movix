import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

import "./style.scss";
import Img from "../lazyLoadImage/Img";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";
import { AiFillHeart } from "react-icons/ai"


const MovieCard = ({ data, fromSearch, mediaType }) => {
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();
    const posterUrl = data.poster_path
        ? url.poster + data.poster_path
        : PosterFallback;

    const [likedItems, setLikedItems] = useState([]);
    const [isLiked, setIsLiked] = useState(false);

    const handleHeartClick = (itemId) => {
        console.log(itemId)
        if (likedItems.includes(itemId)) {
            // Si ya se había dado "Me gusta", lo quitamos de la lista
            setLikedItems(likedItems.filter((id) => id !== itemId));
        } else {
            // Si no se había dado "Me gusta", lo agregamos a la lista
            setLikedItems([...likedItems, itemId]);
        }
        setIsLiked(!isLiked);
    };

    const likeIconClass = `likeIcon ${isLiked ? "liked" : ""}`;
    return (
        <div
            className="movieCard"
            onClick={() =>
                navigate(`/${data.media_type || mediaType}/${data.id}`)
            }
        >
            <div className="posterBlock">
                <Img className="posterImg" src={posterUrl} />
                {!fromSearch && (
                    <React.Fragment>
                        <CircleRating rating={data.vote_average.toFixed(1)} />
                        <Genres data={data.genre_ids.slice(0, 2)} />
                    </React.Fragment>
                )}
                <AiFillHeart
                    className={likeIconClass}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleHeartClick(data.id);
                    }}
                />
            </div>
            <div className="textBlock">
                <span className="title">{data.title || data.name}</span>
                <span className="date">
                    {dayjs(data.release_date).format("MMM D, YYYY")}
                </span>
            </div>

        </div>
    );
};

export default MovieCard;
