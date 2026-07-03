import { NavLink } from "react-router-dom";

function Navbar() {

    const linkStyle = ({ isActive }) => ({
        color: isActive ? "#FCD535" : "#EAECEF",
        textDecoration: "none",
        fontWeight: "600",
        marginRight: "28px"
    });

    return (

        <header
            style={{
                background:"#181A20",
                padding:"18px 40px",
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                borderBottom:"1px solid #2B3139"
            }}
        >

            <h2
                style={{
                    color:"#FCD535",
                    margin:0
                }}
            >
                ⚡ PulseQuant
            </h2>

            <nav>

                <NavLink
                    to="/"
                    style={linkStyle}
                >
                    Market Dashboard
                </NavLink>

                <NavLink
                    to="/backtest"
                    style={linkStyle}
                >
                    Strategy Lab
                </NavLink>

                <NavLink
                    to="/about"
                    style={linkStyle}
                >
                    Architecture
                </NavLink>

            </nav>

        </header>

    );

}

export default Navbar;