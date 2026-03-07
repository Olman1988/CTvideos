import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildIcon from "@mui/icons-material/Build";
import SecurityIcon from "@mui/icons-material/Security";
import FolderIcon from "@mui/icons-material/Folder";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ArticleIcon from "@mui/icons-material/Article";
import UploadIcon from "@mui/icons-material/Upload";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import Breadcrumbs from "../components/Breadcrumbs";
import AdminCard from "@/components/AdminCard";
import CategoryIcon from "@mui/icons-material/Category";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; 
import EmojiEventsIcon  from '@mui/icons-material/EmojiEvents'; 
import CampaignIcon  from '@mui/icons-material/Campaign'; 
import QuizIcon from "@mui/icons-material/Quiz";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import PersonIcon from '@mui/icons-material/Person';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';
import SchoolIcon from '@mui/icons-material/School';


const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [openMenus, setOpenMenus] = useState({
    mantenimientos: false,
    seguridad: false,
    contenidos: false,
    perfiles: false,
    gamificacion:false
  });

  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", height: "auto",minHeight:"100vh" }}>

      {/* SIDEBAR */}
      <Box
        sx={{
          width: sidebarOpen ? 260 : 70,
          backgroundColor: "#1976d2",
          color: "white",
          display: "flex",
          flexDirection: "column",
          p: 2,
          transition: "0.3s",
          position: "relative"
        }}
      >
        {/* BOTÓN */}
        <IconButton
          sx={{
            color: "white",
            position: "absolute",
            top: 10,
            right: sidebarOpen ? 10 : "50%",
            transform: sidebarOpen ? "none" : "translateX(50%)"
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MenuIcon />
        </IconButton>

        {sidebarOpen ? (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 6, mb: 2 }}>
            CETAV
          </Typography>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 6, mb: 2 }}>
            
          </Typography>
        )}


        <List>

          {/* 1️⃣ PANEL ADMINISTRATIVO (SIN SUBMENÚ) */}
          <ListItemButton component={NavLink} to="/admin/">
            <ListItemIcon sx={{ color: "white" }}>
              <DashboardIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Panel administrativo" />}
          </ListItemButton>

          {/* 2️⃣ MANTENIMIENTOS */}
          <ListItemButton onClick={() => toggleMenu("mantenimientos")}>
            <ListItemIcon sx={{ color: "white" }}>
              <BuildIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Mantenimientos" />}
            {sidebarOpen && (openMenus.mantenimientos ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          <Collapse in={openMenus.mantenimientos && sidebarOpen} unmountOnExit>
            <List disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/mantenimientos/sliders">
                <ListItemIcon sx={{ color: "white" }}>
                  <ViewCarouselIcon />
                </ListItemIcon>
                <ListItemText primary="Sliders" />
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/mantenimientos/categorias">
                <ListItemIcon sx={{ color: "white" }}>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Categorías" />
              </ListItemButton>
           <ListItemButton
              sx={{ pl: 4 }}
              component={NavLink}
              to="/admin/mantenimientos/testimonios"
            >
              <ListItemIcon sx={{ color: "white" }}>
                <FormatQuoteIcon />
              </ListItemIcon>
              <ListItemText primary="Testimonios" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              component={NavLink}
              to="/admin/mantenimientos/emociones" // ruta actualizada
            >
              <ListItemIcon sx={{ color: "white" }}>
                <EmojiEmotionsIcon />
              </ListItemIcon>
              <ListItemText primary="Emociones" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              component={NavLink}
              to="/admin/mantenimientos/avatares"
            >
              <ListItemIcon sx={{ color: "white" }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Avatares" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              component={NavLink}
              to="/admin/mantenimientos/marcos" // ruta actualizada
            >
              <ListItemIcon sx={{ color: "white" }}>
                <FilterFramesIcon />
              </ListItemIcon>
              <ListItemText primary="Marcos" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              component={NavLink}
              to="/admin/mantenimientos/centros-educativos" // ruta actualizada
            >
              <ListItemIcon sx={{ color: "white" }}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Centros educativos" />
            </ListItemButton>
        
            </List>
          </Collapse>

          {/* 3️⃣ SEGURIDAD */}
          <ListItemButton onClick={() => toggleMenu("seguridad")}>
            <ListItemIcon sx={{ color: "white" }}>
              <SecurityIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Seguridad" />}
            {sidebarOpen && (openMenus.seguridad ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          <Collapse in={openMenus.seguridad && sidebarOpen} unmountOnExit>
            <List disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/seguridad/usuarios">
                <ListItemIcon sx={{ color: "white" }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Usuarios" />
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/seguridad/roles">
                <ListItemIcon sx={{ color: "white" }}>
                  <VpnKeyIcon />
                </ListItemIcon>
                <ListItemText primary="Roles y permisos" />
              </ListItemButton>
            </List>
          </Collapse>
          {/* 3️⃣ PERSONAS */}
          <ListItemButton onClick={() => toggleMenu("perfiles")}>
            <ListItemIcon sx={{ color: "white" }}>
              <PeopleIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Perfiles" />}
            {sidebarOpen && (openMenus.perfiles ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          <Collapse in={openMenus.perfiles && sidebarOpen} unmountOnExit>
            <List disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/perfiles/estudiantes">
                <ListItemIcon sx={{ color: "white" }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Estudiantes" />
              </ListItemButton> 

              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/perfiles/tutores">
                <ListItemIcon sx={{ color: "white" }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Tutores" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/perfiles/encargados">
                <ListItemIcon sx={{ color: "white" }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Encargados" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* 4️⃣ CONTENIDOS */}
          <ListItemButton onClick={() => toggleMenu("contenidos")}>
            <ListItemIcon sx={{ color: "white" }}>
              <FolderIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Contenidos" />}
            {sidebarOpen && (openMenus.contenidos ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          <Collapse in={openMenus.contenidos && sidebarOpen} unmountOnExit>
            <List disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/contenidos/lista">
                <ListItemIcon sx={{ color: "white" }}>
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText primary="Listado" />
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/contenidos/nuevo">
                <ListItemIcon sx={{ color: "white" }}>
                  <UploadIcon />
                </ListItemIcon>
                <ListItemText primary="Subir contenido" />
              </ListItemButton>
            </List>
          </Collapse>

          {/** GAMIFICACION */}
          <ListItemButton onClick={() => toggleMenu("gamificacion")}>
            <ListItemIcon sx={{ color: "white" }}>
              <AutoAwesomeIcon  />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Gamificación" />}
            {sidebarOpen && (openMenus.gamificacion ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          <Collapse in={openMenus.gamificacion && sidebarOpen} unmountOnExit>
            <List disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/insignias">
                <ListItemIcon sx={{ color: "white" }}>
                  <EmojiEventsIcon  />
                </ListItemIcon>
                <ListItemText primary="Insignias" />
              </ListItemButton>
  
              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/campanas">
                <ListItemIcon sx={{ color: "white" }}>
                  <CampaignIcon  />
                </ListItemIcon>
                <ListItemText primary="Campañas" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/trivias">
                <ListItemIcon sx={{ color: "white" }}>
                  <QuizIcon />
                </ListItemIcon>
                <ListItemText primary="Trivias" />
              </ListItemButton>

              
            </List>
          </Collapse>

        </List>
      </Box>

      {/* CONTENIDO PRINCIPAL */}
      <Box sx={{ flexGrow: 1, backgroundColor: "#f5f5f5" }}>
        <Box
          sx={{
            height: 60,
            backgroundColor: "white",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            px: 4,
            gap: 3,
            boxShadow: 1
          }}
        >
          <IconButton>
            <NotificationsIcon />
          </IconButton>

          <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)}>
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </IconButton>

          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            <MenuItem onClick={() => navigate("/admin/perfil")}>Mi Perfil</MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ p: 3 }}>
          <Breadcrumbs />
        </Box>

        <Box sx={{ px: 3 }}>
        <AdminCard>
          <Outlet />
        </AdminCard>
      </Box>

      </Box>
    </Box>
  );
};

export default MainLayout;
