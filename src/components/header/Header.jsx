import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";

import logo from "../../assets/movix-logo.svg";
import { useAuth } from "../../auth/AuthContext";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import PictureProfile from "../pictureProfile/PictureProfile";


const Header = () => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { authenticated, setAuth } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
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
    }, [authenticated]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);


    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY && !mobileMenu) {
                setShow("hide");
            } else {
                setShow("show");
            }
        } else {
            setShow("top");
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    const redirectToProfile = () => {
        navigate("/profile");
    }

    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
            setTimeout(() => {
                setShowSearch(false);
            }, 1000);
        }
    };

    const openSearch = () => {
        setMobileMenu(false);
        setShowSearch(true);
    };

    const openMobileMenu = () => {
        setMobileMenu(true);
        setShowSearch(false);
    };

    const redirectToLogin = () => {
        navigate("/login");
        setMobileMenu(false);
    }

    const navigationHandler = (type) => {
        if (type === "movie") {
            navigate("/explore/movie");
        } else {
            navigate("/explore/tv");
        }
        setMobileMenu(false);
    };

    const navigateToFavorites = () => {
        navigate("/favorites");
        setMobileMenu(false);
    }

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth(false);
        navigate('/');
    };

    return (
        <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
            <ContentWrapper>
                <div className="logo" onClick={() => navigate("/")}>
                    <img src={logo} alt="" />
                </div>
                <ul className="menuItems">
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("movie")}
                    >
                        Movies
                    </li>
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("tv")}
                    >
                        TV Shows
                    </li>
                    <li className="menuItem">
                        <HiOutlineSearch onClick={openSearch} />
                    </li>
                    {authenticated ? (

                        <>
                            {/* <li className="menuItem">
                                <FaYoutube size={30} onClick={navigateToFavorites} />
                            </li> */}
                            <li className="menuItem" onClick={toggleProfileMenu}>
                                <PictureProfile picture={imageUrl} onClick={redirectToProfile} />
                                {
                                    showProfileMenu && (
                                        <ul className="profileMenu">
                                            <li className="item" onClick={redirectToProfile}>Profile</li>
                                            <li className="item" onClick={logout}>Log out</li>
                                        </ul>
                                    )
                                }
                            </li>
                        </>
                    ) : (
                        <Button variant="contained" color="success" onClick={redirectToLogin} style={{ background: '#e50914' }}>
                            Iniciar Sesion
                        </Button>
                    )}
                </ul>

                <div className="mobileMenuItems">
                    <HiOutlineSearch onClick={openSearch} />
                    {mobileMenu ? (
                        <VscChromeClose onClick={() => setMobileMenu(false)} />
                    ) : (
                        <SlMenu onClick={openMobileMenu} />
                    )}
                </div>
            </ContentWrapper>

            {
                showSearch && (
                    <div className="searchBar">
                        <ContentWrapper>
                            <div className="searchInput">
                                <input
                                    type="text"
                                    placeholder="Search for a movie or tv show...."
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyUp={searchQueryHandler}
                                />
                                <VscChromeClose
                                    onClick={() => setShowSearch(false)}
                                />
                            </div>
                        </ContentWrapper>
                    </div>
                )
            }
        </header >
    );
};

export default Header;
