import dayjs from "dayjs";
import React, { useEffect, useRef } from "react";
import { AiFillHeart } from "react-icons/ai";
import {
    BsFillArrowLeftCircleFill,
    BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useState } from "react";
import PosterFallback from "../../assets/no-poster.png";
import CircleRating from "../circleRating/CircleRating";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import Genres from "../genres/Genres";
import Img from "../lazyLoadImage/Img";

import { useAuth } from "../../auth/AuthContext";
import "./style.scss";

const Carousel = ({ data, loading, endpoint, title }) => {
    const carouselContainer = useRef();
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();
    const [likedItems, setLikedItems] = useState([]);
    const { authenticated } = useAuth();
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        // console.log("Carousel: ", authenticated)
        const email = localStorage.getItem('email');
        // console.log(authenticated)

        if (authenticated == true)
            axios.post('http://localhost:3000/user/favorites', { email })
                .then((response) => {
                    // console.log(response.data)
                    if (response.status === 200)
                        setLikedItems(response.data);

                    // console.log(likedItems)
                })
                .catch((error) => {
                    console.error('Error en la solicitud POST:', error);
                });
    }, [authenticated]);

    // console.log(data)
    const navigation = (dir) => {
        const container = carouselContainer.current;

        const scrollAmount =
            dir === "left"
                ? container.scrollLeft - (container.offsetWidth + 20)
                : container.scrollLeft + (container.offsetWidth + 20);

        container.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    const skItem = () => {
        return (
            <div className="skeletonItem">
                <div className="posterBlock skeleton"></div>
                <div className="textBlock">
                    <div className="title skeleton"></div>
                    <div className="date skeleton"></div>
                </div>
            </div>
        );
    };

    const handleHeartClick = (item) => {
        const email = localStorage.getItem('email');
        // console.log(typeof likedItems)
        // console.log(item.genre_ids)


        if (likedItems.includes(item.id.toString())) {
            setLikedItems(likedItems.filter((id) => id !== item.id.toString()));

            axios.post('http://localhost:3000/user/removeFromFavorites', { email: email, itemId: item.id, genreId: item.genre_ids })
                .then((response) => {
                    // console.log(response)
                    setLikedItems(response.data.favorites)
                })
                .catch((error) => {
                    console.error('Error en la solicitud remove from favorites:', error);
                })

        } else {
            setLikedItems([...likedItems, item.id.toString()]);
            const requestData = {
                email: localStorage.getItem('email'),
                itemId: item.id,
                genreId: item.genre_ids
            }

            axios.post('http://localhost:3000/user/add-to-favorites', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => {
                    // console.log(response.data)
                })
                .catch((error) => {
                    console.error('Error en la solicitud:', error);
                });
        }
    };

    return (
        <div className="carousel">
            <ContentWrapper>
                {title && <div className="carouselTitle">{title}</div>}
                <BsFillArrowLeftCircleFill
                    className="carouselLeftNav arrow"
                    onClick={() => navigation("left")}
                />
                <BsFillArrowRightCircleFill
                    className="carouselRighttNav arrow"
                    onClick={() => navigation("right")}
                />
                {!loading ? (
                    <div className="carouselItems" ref={carouselContainer}>
                        {data?.map((item) => {
                            const posterUrl = item.poster_path
                                ? url.poster + item.poster_path
                                : PosterFallback;
                            // console.log(item)
                            const isLiked = likedItems.includes(item.id.toString());
                            return (
                                <div
                                    key={item.id}
                                    className={`carouselItem ${isLiked ? 'liked' : ''}`}
                                    onClick={() =>
                                        navigate(
                                            `/${item.media_type || endpoint}/${item.id
                                            }`
                                        )
                                    }
                                >
                                    <div className="posterBlock">
                                        <Img src={posterUrl} />
                                        <CircleRating
                                            rating={item.vote_average.toFixed(
                                                1
                                            )}
                                        />
                                        <Genres
                                            data={item.genre_ids.slice(0, 2)}
                                        />
                                        {
                                            authenticated &&
                                            <AiFillHeart
                                                className={`likeIcon ${isLiked ? 'liked' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleHeartClick(item);
                                                }}
                                            />
                                        }
                                    </div>
                                    <div className="textBlock">
                                        <span className="title">
                                            {item.title || item.name}
                                        </span>
                                        <span className="date">
                                            {dayjs(item.release_date || item.first_air_date).format(
                                                "MMM D, YYYY"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="loadingSkeleton">
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Carousel;
