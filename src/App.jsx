import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";

import { useDispatch, useSelector } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import { useAuth } from './auth/AuthContext';

import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import PageNotFound from "./pages/404/PageNotFound";
import DashBoard from "./pages/dashboard/DashBoard";
import Details from "./pages/details/Details";
import Explore from "./pages/explore/Explore";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import SearchResult from "./pages/searchResult/SearchResult";
import SignUp from "./pages/singup/SingUp";

function App() {
    const dispatch = useDispatch();
    const { url } = useSelector((state) => state.home);
    const { setAuth } = useAuth();

    useEffect(() => {
        fetchApiConfig();
        genresCall();
        const sessionCookie = document.cookie;

        const cookieParts = sessionCookie.split('; ');
        console.log('cookieParts:', cookieParts);

        if (localStorage.getItem("token")) {
            setAuth(true);
        }
    }, []);

    const fetchApiConfig = () => {
        fetchDataFromApi("/configuration").then((res) => {
            const url = {
                backdrop: res.images.secure_base_url + "original",
                poster: res.images.secure_base_url + "original",
                profile: res.images.secure_base_url + "original",
            };

            dispatch(getApiConfiguration(url));
        });
    };

    const genresCall = async () => {
        let promises = [];
        let endPoints = ["tv", "movie"];
        let allGenres = {};

        endPoints.forEach((url) => {
            promises.push(fetchDataFromApi(`/genre/${url}/list`));
        });

        const data = await Promise.all(promises);
        // console.log(data);
        data.map(({ genres }) => {
            return genres.map((item) => (allGenres[item.id] = item));
        });
        dispatch(getGenres(allGenres));
    };

    // const email = localStorage.getItem('email');
    // const [dataLoaded, setDataLoaded] = useState(false);
    // const [movies, setMovies] = useState([]);
    // const [tvShows, setTvShows] = useState([]);

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:mediaType/:id" element={<Details />} />
                <Route path="/search/:query" element={<SearchResult />} />
                <Route path="/explore/:mediaType" element={<Explore />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                {/* <Route path="/favorites" movies={movies} tvShows={tvShows} element={<Favorites />} /> */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
