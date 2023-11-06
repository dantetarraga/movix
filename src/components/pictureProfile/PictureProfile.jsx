import { Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";

const PictureProfile = ({ picture, email, isProfilePage }) => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
    });
    const [image, setImage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');


    useEffect(() => {
        axios.get('http://localhost:3000/user/userdata', { headers: { Authorization: localStorage.getItem('token') } })
            .then((response) => response.data)
            .then((data) => {
                console.log(data);
                setUserData(data.user);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }, []);

    const pictureStyle = {
        width: isProfilePage ? "250px" : "40px",
    }

    const profileStyle = {
        position: isProfilePage ? "absolute" : "relative",
    }

    const handleEdit = () => {
        console.log("Edit user");

        setIsEditing(true);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    }

    const handleSave = () => {
        console.log(userData)
        axios.put('http://localhost:3000/user/update', { email: userData.email, password: password, newPassword: newPassword, username: userData.username },
            {
                headers: { Authorization: localStorage.getItem('token') }
            })
            .then((response) => response.data)
            .then((data) => {
                console.log(data);
                setUserData(data);
                setIsEditing(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }

    const handleCancel = () => {
        setIsEditing(false);
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData({
            ...userData,
            [name]: value,
        });

        console.log(userData)
    };

    return (
        <div className="picture-profile" style={profileStyle}>
            <img src={picture} alt={email} style={pictureStyle} />

            {isProfilePage && (
                <div className="container-profile">
                    <div className="container">
                        <h1>User Profile</h1>
                        <div>
                            <label className="label"><strong>User Name:</strong></label>
                            <input
                                type="text"
                                name="username"
                                value={userData.username}
                                onChange={handleInputChange}
                                className={`input-field ${isEditing ? '' : 'disabled'}`}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="label"><strong>Email:</strong></label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleInputChange}
                                className={`input-field ${isEditing ? '' : 'disabled'}`}
                                disabled={!isEditing}
                            />
                        </div>
                        {
                            isEditing && (
                                <div>
                                    <div className="container-icon">
                                        <Edit className="edit-icon" size={20} onClick={handleEdit} />
                                    </div>
                                    <div>
                                        <label className="label"><strong>Ingrese nueva contraseña:</strong></label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={newPassword}
                                            onChange={handleNewPasswordChange}
                                            className={`input-field ${isEditing ? '' : 'disabled'}`}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <label className="label"><strong>Ingrese contraseña actual:</strong></label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            className={`input-field ${isEditing ? '' : 'disabled'}`}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            )
                        }
                        <div className="buttons">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} className="edit-button">
                                        Guardar
                                    </button>
                                    <button onClick={handleCancel} className="cancel-button">
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleEdit} className="edit-button">
                                    Editar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}
export default PictureProfile;