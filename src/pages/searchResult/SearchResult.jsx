import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import "./style.scss";

import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import noResults from "../../assets/no-results.png";
import { useAuth } from "../../auth/AuthContext";

const SearchResult = () => {
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const { query } = useParams();
    const { filters, clearFilters } = useAuth();

    console.log(filters.with_genres)

    const fetchInitialData = () => {
        setLoading(true);
        fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`)
            .then(
                (res) => {
                    setData(res);
                    setPageNum((prev) => prev + 1);
                    setLoading(false);
                    console.log(res)
                    return res;
                }
            ).then((res) => {
                // console.log(typeof filters.with_genres)
                const array = filters.with_genres.split(',')
                const arrayFilters = array.map((cadena) => parseInt(cadena));
                console.log(arrayFilters)
                // console.log(filters.with_genres.length)
                if (filters.with_genres.length > 1) {
                    const results_filter = res.results.filter((item) => {
                        if (item.genre_ids) {
                            return item.genre_ids.some((id) => arrayFilters.includes(id));
                        }
                    });
                    // console.log(newData)
                    const newData = {
                        ...data,
                        results: results_filter,
                        total_results: results_filter.length,
                        total_pages: 1
                    }

                    console.log(newData)
                    setData(newData);
                }
            }).finally(() => {
                clearFilters();
            });
    };

    const fetchNextPageData = () => {
        fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
            (res) => {
                if (data?.results) {
                    setData({
                        ...data,
                        results: [...data?.results, ...res.results],
                    });
                } else {
                    setData(res);
                }
                setPageNum((prev) => prev + 1);
            }
        );
    };



    useEffect(() => {
        setPageNum(1);
        fetchInitialData();
    }, [query]);

    return (
        <div className="searchResultsPage">
            {loading && <Spinner initial={true} />}
            {!loading && (
                <ContentWrapper>
                    {data?.results?.length > 0 ? (
                        <>
                            <div className="pageTitle">
                                {`Search ${data?.total_results > 1 ? "results" : "result"
                                    } of '${query}'`}
                            </div>
                            <InfiniteScroll
                                className="content"
                                dataLength={data?.results?.length || []}
                                next={fetchNextPageData}
                                hasMore={pageNum <= data?.total_pages}
                                loader={<Spinner />}
                            >
                                {data?.results.map((item, index) => {
                                    if (item.media_type === "person") return;
                                    return (
                                        <MovieCard key={index} data={item} fromSearch={true} />
                                    );
                                })}
                            </InfiniteScroll>
                        </>
                    ) : (
                        <span className="resultNotFound">Sorry, Results not found!</span>
                    )}
                </ContentWrapper>
            )}
        </div>
    );
};

export default SearchResult;