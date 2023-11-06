import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./style.scss";
import useFetch from "../../hooks/useFetch";
import Img from "../lazyLoadImage/Img";

const HeroBanner = () => {
    const [background, setBackground] = useState("");
    const { data, loading } = useFetch("/movie/upcoming");
    const { url } = useSelector((state) => state.home);

    useEffect(() => {
        const bg =
            url.backdrop +
            data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
        setBackground(bg);
    }, [data]);

    return (
        <div className="heroBanner">
            {!loading && (
                <div className="backdrop-img">
                    <Img src={background} />
                </div>
            )}
        </div>
    );
}

export default HeroBanner;