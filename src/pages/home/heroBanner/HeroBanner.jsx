import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";
import Select from "react-select";

import useFetch from "../../../hooks/useFetch";

import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import { Dataset, KeyboardOptionKeySharp } from "@mui/icons-material";
import { SlOptions, SlOptionsVertical } from "react-icons/sl";
import { fetchDataFromApi } from "../../../utils/api";
import { useAuth } from "../../../auth/AuthContext";

// let filters = {};

const HeroBanner = () => {
    const [background, setBackground] = useState("");
    const [query, setQuery] = useState("");
    const [genre, setGenre] = useState(null);
    const navigate = useNavigate();
    const { filters, setAddFilters } = useAuth();

    // const { mediaType } = useParams();
    const { data: genresData } = useFetch(`/genre/movie/list`);

    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
        }
    };

    // Accessing the images
    const { url } = useSelector((state) => state.home);

    const { data, loading } = useFetch("/movie/upcoming");

    useEffect(() => {
        const bg =
            url.backdrop +
            data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
        setBackground(bg);
    }, [data]);

    const onChange = (selectedItems, action) => {
        if (action.name === "genres") {
            setGenre(selectedItems);
            if (action.action !== "clear") {
                let genreId = selectedItems.map((g) => g.id);
                genreId = JSON.stringify(genreId).slice(1, -1);
                filters.with_genres = genreId;
            } else {
                delete filters.with_genres;
            }
        }
        console.log(filters);
    };

    return (
        <div className="heroBanner">
            <div className="backdrop-img">{!loading && <Img src={background} />}</div>

            <div className="opacity-layer"></div>

            <ContentWrapper>
                <div className="heroBannerContent">
                    <span className="title">Welcome</span>
                    <span className="subTitle">
                        Millions of movies, TV shows and people to discover. Explore now.
                    </span>
                    <div className="searchInput">
                        <input
                            type="text"
                            placeholder="Search for a movie or TV show..."
                            onKeyUp={searchQueryHandler}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="filters">
                            <Select
                                isMulti
                                name="genres"
                                value={genre}
                                closeMenuOnSelect={false}
                                options={genresData?.genres}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                onChange={onChange}
                                placeholder="Select genres"
                                className="react-select-container genresDD"
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default HeroBanner;
