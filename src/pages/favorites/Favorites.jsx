import axios from 'axios';
import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import ContentWrapper from '../../components/contentWrapper/ContentWrapper';
import Carousel from '../../components/carousel/Carousel';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCard from '../../components/movieCard/MovieCard';

const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

const headers = {
    accept: 'application/json',
    Authorization: "bearer " + TMDB_TOKEN,
};
const axiosConfig = {
    headers: headers,
};

const Favorites = (movies, tvShows) => {
    const email = localStorage.getItem('email');
    console.log(email)
    console.log(movies)
    const [data, setData] = useState({ results: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchDataById = async (id, mediaType) => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/${mediaType}/${id}?language=en-US`, axiosConfig);
                const data = response.data;
                return data;
            } catch (error) {
                console.error(`Error al obtener datos para ${mediaType} con ID ${id}:`, error);
                return null;
            }
        };

        const getAllData = async () => {
            const results = [];

            for (const favoriteItem of movies) {
                const result = await fetchDataById(favoriteItem, 'movie');
                if (result) {
                    results.push(result);
                    setData((prevData) => ({
                        ...prevData,
                        results: results,
                    }));
                }
            }

            for (const favoriteItem of tvShows) {
                const result = await fetchDataById(favoriteItem, 'tvshow');
                if (result) {
                    results.push(result);
                    setData((prevData) => ({
                        ...prevData,
                        results: results,
                    }));
                }
            }
        };

        const dataLoading = async () => {
            await getAllData();
            console.log('Data: ', data)
            setLoading(false);
        }

        dataLoading();

    }, []);

    if (!loading) {
        console.log('Data ', data);
    }

    return (
        <ContentWrapper>
            <>
                {!loading && data?.results?.length > 0 &&
                    data.results.map((item, index) => {
                        return (
                            <MovieCard
                                key={index}
                                data={item}
                                fromSearch={false}
                                mediaType='movie'
                            />
                        );
                    })}
            </>
        </ContentWrapper>
    )
}

export default Favorites;