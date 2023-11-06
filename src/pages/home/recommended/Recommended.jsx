import React, { useEffect, useState } from "react";

import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";

import axios from "axios";
import { useAuth } from "../../../auth/AuthContext";
import useFetch from "../../../hooks/useFetch";
import { fetchDataFromApi } from "../../../utils/api";

const Recommended = () => {
    const { authenticated } = useAuth();
    const [filters, setFilters] = useState({});
    const [data1, setData] = useState(null);
    const [mediaType, setMediaType] = useState("movie");

    const [endpoint, setEndpoint] = useState("movie");

    const { data, loading } = useFetch(`/${endpoint}/top_rated`);

    const onTabChange = (tab) => {
        setMediaType(tab === "Movies" ? "movie" : "tv");
        console.log(mediaType)
    };

    useEffect(() => {
        const email = localStorage.getItem('email');
        axios.post('http://localhost:3000/user/genres', { email })
            .then((response) => {
                console.log(response.data)
                setFilters(response.data)
            })
            .then(() => {
                if (filters.length === 0) return;
                fetchDataFromApi(`/discover/${mediaType}`, filters).then((res) => {
                    setData(res);
                    console.log(res)
                })
                    .then(() => {
                        setData(data1.results.map(item => item.genre_ids = item.genre_ids.filter(id => id in filters)))
                        console.log(data1)
                    });
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }, [])

    return (
        filters.length > 0 && authenticated ? (
            <div className="carouselSection">
                <ContentWrapper>
                    <span className="carouselTitle">Recommended</span>
                    <SwitchTabs data={["Movies", "TV Shows"]} onTabChange={onTabChange} />
                </ContentWrapper>
                <Carousel data={data1?.results} loading={loading} />
            </div>
        ) : (
            <div></div>
        )
    );
}

export default Recommended;