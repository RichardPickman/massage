import { Box, Button, Card, TextField, Link } from "@mui/material";
import { useRef } from "react";
import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { UserContext } from "../../context/userContext";


const Login = () => {
  const [userState, dispatch] = useContext(UserContext);
  const login = useRef();
  const password = useRef();

  const click = async () => {
    try {
        let data = await login(login, password);
        
        dispatch({ type: "LOGIN", payload: { ...data } });
    } catch (e) {
        alert(e.response.data.message)
    }
  }

  return (
    <Card variant="outlined">
      <Box display="flex" flexDirection="column" margin={3} gap={2}>
        <TextField variant="outlined" label="Login or email" ref={login} />
        <TextField variant="outlined" label="Password" ref={password} type="password" />
        <Button onClick={click}>LOGIN</Button>
        <Button>
          <Link to="/register" underline="none" component={RouterLink}>
            SIGN IN
          </Link>
        </Button>
      </Box>
    </Card>
  )
}

export default Login;
