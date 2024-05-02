import * as React from "react";
import { useContext } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import LogoutIcon from "@mui/icons-material/Logout";

import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import styles from "./SideBar.module.css";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import UserContext from "../context/user";

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const userCtx = useContext(UserContext);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const role = userCtx.role;

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedInId");
    userCtx.setAccessToken("");
    userCtx.setRole("");
    userCtx.setLoggedInId("");
    navigate(`/`);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      {role === 2 && (
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/BusinessOwnerPage">
              <ListItemIcon>
                <PersonSearchIcon />
              </ListItemIcon>
              <ListItemText primary={"BusinessPage"} />
            </ListItemButton>
          </ListItem>
        </List>
      )}
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/OrdersPage">
            <ListItemIcon>
              <PersonSearchIcon />
            </ListItemIcon>
            <ListItemText primary={"Order Page"} />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/HomePage">
            <ListItemIcon>
              <ModeEditIcon />
            </ListItemIcon>
            <ListItemText primary={"Shops"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/Cart">
            <ListItemIcon>
              <ShoppingCartOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={"Cart"} />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Log Out"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className={styles.rightarrow}>
      <Button onClick={toggleDrawer(true)}>
        <KeyboardDoubleArrowRightIcon className="Mui-fontSizeLarge"></KeyboardDoubleArrowRightIcon>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
