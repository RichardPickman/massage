import { Link as RouterLink } from "react-router-dom";
import { Box, Link } from "@mui/material";
import Theme from '../Theme'

const Header = () => {
  return (
    <header className="header">
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <ul className="header__list">
          <Box display="flex" justifyContent="center" alignItems="center" gap={4} margin={2}> 
            <li className="header__link">
              <Link to="/" component={RouterLink}>
                Home
              </Link>
            </li>
            <li className="header__link">
              <Link to="/lectures" component={RouterLink} >
                Lectures
              </Link>
            </li>
            <li className="header__link">
              <Link to="/quizzes" component={RouterLink} >
                Quizzes
              </Link>
            </li>
            <li className="header__link">
              <Link to="/constructor" component={RouterLink} >
                Constructor
              </Link>
            </li>
            <li className="header__link">
              <Theme />
            </li>
          </Box>
        </ul>
        {/* TODO: ADD ACCOUNTS */}
        {/* {userState.isAuth && 
          <ul className="header__list">
          <Box display="flex" justifyContent="center" alignItems="center" gap={4} margin={2}> 
            <li className="header__link">
              <Link to="/login" component={RouterLink} >
                <Avatar src="./img/no_avatar" />
              </Link>
            </li>
            <li className="header__link">
              <Theme />
            </li>
          </Box>
        </ul>
        }
        {!userState.isAuth && 
          <ul className="header__list">
            <Box display="flex" justifyContent="center" alignItems="center" gap={4} margin={2}> 
              <li className="header__link">
                <Link to="/login" component={RouterLink} >
                  Login
                </Link>
              </li>
              <li className="header__link">
                <Link to="/register" component={RouterLink} >
                  Register
                </Link>
              </li>
              <li className="header__link">
                <Theme />
              </li>
            </Box>
          </ul>
        } */}
      </Box>
    </header>
  )
}

export default Header;
