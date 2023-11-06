import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Item = ({ idMovie, email, deleteItem }) => {
    const [movieData, setMovieData] = useState(null);

    useEffect(() => {
        const apiUrl = `https://api.themoviedb.org/3/movie/${idMovie}?language=en-US`;
        const axiosConfig = {
            method: 'get',
            url: apiUrl,
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTExODA5YzBhOTZiYTJkMmQzYjZlZjQ2ZGM0MWZmOCIsInN1YiI6IjY0ZWUxOWU0YzNjODkxMDExZGEwODQwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9PRcE5JksLTZOVyQmfmKnbSYG1L0sTmwL4Y-g0KA95o'
            }
        };

        axios(axiosConfig)
            .then((response) => {
                setMovieData(response.data);
            })
            .catch((error) => {
                console.error(`Error al obtener los datos de la película ${idMovie}:`, error);
            });
    }, [idMovie]);


    const handleDeleteFavorite = () => {
        axios
            .post(`http://localhost:3000/user/removeItemFavorites`, { email, itemId: idMovie })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error al eliminar la película de favoritos:', error);
            });

        deleteItem(idMovie, email);
    };

    return (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
            {
                movieData && (
                    <div>
                        <h3>{movieData.title}</h3>
                        <p>{movieData.overview}</p>
                        <IconButton onClick={handleDeleteFavorite}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </div>
                )
            }
        </Paper>
    );
}

export default Item;
