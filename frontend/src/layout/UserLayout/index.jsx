import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "../../config/redux/action/authAction";
import Navbar from "../../components/Navbar";

function UserLayout({ children }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !user) {
            dispatch(getAboutUser());
        }
    }, [dispatch, user]);

    return (
        <div className="userLayout bg-zinc-50 min-h-screen">
            <Navbar />
            {children}
        </div>
    )
}

export default UserLayout;