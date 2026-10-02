import Navbar from "../../components/Navbar";

function UserLayout({ children }) {
    return (
        <div className="userLayout">
            <Navbar />
            {children}
        </div>
    )
}

export default UserLayout;