import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Item from '../../item/Item';

export default function DashBoard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios
            .get('http://localhost:3000/user/all')
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener los usuarios:', error);
            });
    };

    const handleDeleteItem = (itemId, email) => {
        const updateUsers = users.map((user) => {
            if (user.email === email) {
                return {
                    ...user,
                    favorites: user.favorites.filter((id) => id !== itemId),
                };
            }

            return user;
        })
        setUsers(updateUsers)
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Favorites</TableCell>
                        <TableCell>Genres</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell component="th" scope="row">
                                {user.username}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                {user.favorites.filter((itemId) => itemId !== null).map((itemId) => (
                                    <Item key={itemId} idMovie={itemId} email={user.email} deleteItem={handleDeleteItem}>

                                    </Item>
                                ))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
