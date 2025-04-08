import { Code, Dashboard, Info } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CSSObject, styled, Theme, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";

import { useThemeStore } from "../store";
import Root from "./root";

const navLinks = [
  { icon: <Dashboard />, name: "dashboard", path: "/" },
  { icon: <Info />, name: "about", path: "/about" },
  { icon: <Code />, name: "examples", path: "/examples" },
];

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  overflowX: "hidden",
  transition: theme.transitions.create("width", {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.sharp,
  }),
  width: drawerWidth,
});

const closedMixin = (theme: Theme): CSSObject => ({
  overflowX: "hidden",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  transition: theme.transitions.create("width", {
    duration: theme.transitions.duration.leavingScreen,
    easing: theme.transitions.easing.sharp,
  }),
  width: `calc(${theme.spacing(7)} + 1px)`,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["width", "margin"], {
    duration: theme.transitions.duration.leavingScreen,
    easing: theme.transitions.easing.sharp,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["width", "margin"], {
          duration: theme.transitions.duration.enteringScreen,
          easing: theme.transitions.easing.sharp,
        }),
        width: `calc(100% - ${drawerWidth}px)`,
      },
    },
  ],
  zIndex: theme.zIndex.drawer + 1,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  boxSizing: "border-box",
  flexShrink: 0,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
  whiteSpace: "nowrap",
  width: drawerWidth,
}));

export default function Layout() {
  const navigate = useNavigate();
  const theme = useTheme();

  // this is global state from zustand, this is not material ui
  const { toggleDashboard, ui } = useThemeStore((state) => state);

  return (
    <aside className="flex">
      <AppBar open={ui.dashboard.open} position="fixed">
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            color="inherit"
            edge="start"
            onClick={toggleDashboard}
            sx={[{ marginRight: 5 }, ui.dashboard.open && { display: "none" }]}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="div" noWrap variant="h6">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={ui.dashboard.open} variant="permanent">
        <DrawerHeader>
          <IconButton onClick={toggleDashboard}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navLinks.map(({ icon, name, path }, index) => (
            <ListItem disablePadding key={index} sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => {
                  navigate(path);
                }}
                sx={[
                  { minHeight: 48, px: 2.5 },
                  ui.dashboard.open
                    ? { justifyContent: "initial" }
                    : { justifyContent: "center" },
                ]}
              >
                <ListItemIcon
                  sx={[
                    { justifyContent: "center", minWidth: 0 },
                    ui.dashboard.open ? { mr: 3 } : { mr: "auto" },
                  ]}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={name}
                  sx={[ui.dashboard.open ? { opacity: 1 } : { opacity: 0 }]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Root />
      </Box>
    </aside>
  );
}
