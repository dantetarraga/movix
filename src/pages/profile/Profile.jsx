import { Avatar } from "@mui/material";
import HeroBanner from "../../components/heroBanner/HeroBanner";
import PictureProfile from "../../components/pictureProfile/PictureProfile"
import imgPicture from "../../assets/profile1.png";
import { useEffect, useState } from "react";
import axios from "axios";

import "./style.scss";

const Profile = () => {
    const [imageUrl, setImageUrl] = useState('');
    useEffect(() => {
        const email = localStorage.getItem('email'); // Reemplaza con la obtención del correo del usuario correcto
        axios
            .post('http://localhost:3000/user/imgUser', { email }, { responseType: 'blob' })
            .then((response) => {
                if (response.status === 200) {
                    const blob = new Blob([response.data], { type: 'image/png' });
                    const imageUrl = URL.createObjectURL(blob);
                    setImageUrl(imageUrl);
                } else {
                    throw new Error('No se pudo obtener la imagen del usuario');
                }
            })
            .catch((error) => {
                console.error('Error al obtener la imagen:', error);
            });
    }, []);
    return (
        <section className="profile">
            <HeroBanner />
            <div className="profile__form">
                <PictureProfile className="picture" picture={imageUrl} isProfilePage={true} />
            </div>
        </section>
    )
}

export default Profile;