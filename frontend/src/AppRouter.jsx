import { createBrowserRouter, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/public/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Forbidden from "./pages/Forbidden";
import UserLogin from "./pages/public/Login";

import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivateUserRoute from "./components/PrivateUserRoute";


// Seguridad
import Users from "./pages/security/Users";
import UserCreate from "./pages/security/UserCreate";
import UserEdit from "./pages/security/UserEdit";
import Roles from "./pages/security/Roles";
import RoleCreate from "./pages/security/RoleCreate";
import RoleEdit from "./pages/security/RoleEdit";
import Permissions from "./pages/security/Permissions";

// Catálogos
import Sliders from "./pages/catalogues/Sliders";
import SliderCreate from "./pages/catalogues/SliderCreate";
import SliderEdit from "./pages/catalogues/SliderEdit";
import Categories from "./pages/catalogues/Categories";
import CategoryCreate from "./pages/catalogues/CategoryCreate";
import CategoryEdit from "./pages/catalogues/CategoryEdit";
import Testimonies from "./pages/catalogues/Testimonies";
import TestimonyCreate from "./pages/catalogues/TestimonyCreate";
import TestimonyEdit from "./pages/catalogues/TestimonyEdit";
import Emotions from "./pages/catalogues/Emotions";
import EmotionCreate from "./pages/catalogues/EmotionCreate";
import EmotionEdit from "./pages/catalogues/EmotionEdit";



// Perfiles
import Students from "./pages/profiles/Students";
import StudentCreate from "./pages/profiles/StudentCreate";
import StudentEdit from "./pages/profiles/StudentEdit";
import Tutors from "./pages/profiles/Tutors";
import TutorCreate from "./pages/profiles/TutorCreate";
import TutorEdit from "./pages/profiles/TutorEdit";
import Guardians from "./pages/profiles/Guardians";
import GuardianCreate from "./pages/profiles/GuardianCreate";
import GuardianEdit from "./pages/profiles/GuardianEdit";

// Gamificación
import Badges from "./pages/gamification/Badges";
import BadgeCreate from "./pages/gamification/BadgeCreate";
import BadgeEdit from "./pages/gamification/BadgeEdit";
import Campaigns from "./pages/gamification/Campaigns";
import CampaignCreate from "./pages/gamification/CampaignCreate";
import CampaignEdit from "./pages/gamification/CampaignEdit";
import Trivias from "./pages/gamification/Trivias";
import TriviaCreate from "./pages/gamification/TriviaCreate";
import TriviaEdit from "./pages/gamification/TriviaEdit";

//Content
import ContentCreate from "./pages/contents/ContentCreate";
import ContentList from "./pages/contents/ContentList";
import ContentEdit from "./pages/contents/ContentEdit";
//ContentList


//Avatars
import Avatars from "./pages/catalogues/Avatars";
import AvatarCreate from "./pages/catalogues/AvatarCreate";
import AvatarEdit from "./pages/catalogues/AvatarEdit";

//Backgrounds
import Backgrounds from "./pages/catalogues/Backgrounds";
import BackgroundCreate from "./pages/catalogues/BackgroundCreate";
import BackgroundEdit from "./pages/catalogues/BackgroundEdit";

//Centers
import CenterCreate from "./pages/catalogues/CenterCreate";
import CenterEdit from "./pages/catalogues/CenterEdit";
import Centers from "./pages/catalogues/Centers";

//Usuarios
import Profile from "./pages/public/student/Profile";


const router = createBrowserRouter([
  // 🌍 PÚBLICO
  {
    element: <PublicLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    element: <PublicLayout />,
    children: [{ path: "/usuarios/login", element: <UserLogin /> }],
  },
  // USERS
  {
    path: "/usuarios",
    element: (
      <PrivateUserRoute >
        <PublicLayout />
      </PrivateUserRoute>
    ), 
    children: [
      { index: true, 
       element: (
            <Profile />
        ), 
      },
    ],
  },

  // 🔐 LOGIN
  { path: "/login", element: <Login /> },

  // 🛡 ADMIN
  {
    path: "/admin",
    element: (
      <PrivateRoute >
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, 
       element: (
          <ProtectedRoute permiso="dashboard.ver">
            <Dashboard />
          </ProtectedRoute>
        ), 
      },

      // Usuarios
      {
        path: "seguridad/usuarios",
        element: (
          <ProtectedRoute permiso="usuarios.ver">
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "seguridad/usuarios/nuevo",
        element: (
          <ProtectedRoute permiso="usuarios.crear">
            <UserCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "seguridad/usuarios/:uuid",
        element: (
          <ProtectedRoute permiso="usuarios.editar">
            <UserEdit />
          </ProtectedRoute>
        ),
      },

      // Roles
      {
        path: "seguridad/roles",
        element: (
          <ProtectedRoute permiso="roles.ver">
            <Roles />
          </ProtectedRoute>
        ),
      },
      {
        path: "seguridad/roles/nuevo",
        element: (
          <ProtectedRoute permiso="roles.crear">
            <RoleCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "seguridad/roles/:uuid",
        element: (
          <ProtectedRoute permiso="roles.editar">
            <RoleEdit />
          </ProtectedRoute>
        ),
      },

      // Permisos
      {
        path: "seguridad/permisos/:uuid",
        element: (
          <ProtectedRoute permiso="permisos.ver">
            <Permissions />
          </ProtectedRoute>
        ),
      },

      // Sliders
      {
        path: "mantenimientos/sliders",
        element: (
          <ProtectedRoute permiso="sliders.ver">
            <Sliders />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/sliders/nuevo",
        element: (
          <ProtectedRoute permiso="sliders.crear">
            <SliderCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/sliders/:uuid",
        element: (
          <ProtectedRoute permiso="sliders.editar">
            <SliderEdit />
          </ProtectedRoute>
        ),
      },

      // Categorías
      {
        path: "mantenimientos/categorias",
        element: (
          <ProtectedRoute permiso="categorias.ver">
            <Categories />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/categorias/nuevo",
        element: (
          <ProtectedRoute permiso="categorias.crear">
            <CategoryCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/categorias/:uuid",
        element: (
          <ProtectedRoute permiso="categorias.editar">
            <CategoryEdit />
          </ProtectedRoute>
        ),
      },

      // Estudiantes
      {
        path: "perfiles/estudiantes",
        element: (
          <ProtectedRoute permiso="estudiantes.ver">
            <Students />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfiles/estudiantes/nuevo",
        element: (
          <ProtectedRoute permiso="estudiantes.crear">
            <StudentCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfiles/estudiantes/:uuid",
        element: (
          <ProtectedRoute permiso="estudiantes.editar">
            <StudentEdit />
          </ProtectedRoute>
        ),
      },

      // Tutores
      {
        path: "perfiles/tutores",
        element: (
          <ProtectedRoute permiso="tutores.ver">
            <Tutors />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfiles/tutores/nuevo",
        element: (
          <ProtectedRoute permiso="tutores.crear">
            <TutorCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfiles/tutores/:uuid",
        element: (
          <ProtectedRoute permiso="tutores.editar">
            <TutorEdit />
          </ProtectedRoute>
        ),
      },

      // Encargados
      {
        path: "perfiles/encargados",
        element: (
          <ProtectedRoute permiso="encargados.ver">
            <Guardians />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfiles/encargados/nuevo",
        element: (
          <ProtectedRoute permiso="encargados.crear">
            <GuardianCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfiles/encargados/:uuid",
        element: (
          <ProtectedRoute permiso="encargados.editar">
            <GuardianEdit />
          </ProtectedRoute>
        ),
      },

      // Insignias
      {
        path: "insignias",
        element: (
          <ProtectedRoute permiso="insignias.ver">
            <Badges />
          </ProtectedRoute>
        ),
      },
      {
        path: "insignias/nuevo",
        element: (
          <ProtectedRoute permiso="insignias.crear">
            <BadgeCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "insignias/:uuid",
        element: (
          <ProtectedRoute permiso="insignias.editar">
            <BadgeEdit />
          </ProtectedRoute>
        ),
      },

      // Campañas
      {
        path: "campanas",
        element: (
          <ProtectedRoute permiso="campanas.ver">
            <Campaigns />
          </ProtectedRoute>
        ),
      },
      {
        path: "campanas/nuevo",
        element: (
          <ProtectedRoute permiso="campanas.crear">
            <CampaignCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "campanas/:uuid",
        element: (
          <ProtectedRoute permiso="campanas.editar">
            <CampaignEdit />
          </ProtectedRoute>
        ),
      },

      // Trivias
      {
        path: "trivias",
        element: (
          <ProtectedRoute permiso="trivias.ver">
            <Trivias />
          </ProtectedRoute>
        ),
      },
      {
        path: "trivias/nuevo",
        element: (
          <ProtectedRoute permiso="trivias.crear">
            <TriviaCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "trivias/:uuid",
        element: (
          <ProtectedRoute permiso="trivias.editar">
            <TriviaEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/testimonios",
        element: (
          <ProtectedRoute permiso="testimonios.ver">
            <Testimonies />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/testimonios/nuevo",
        element: (
          <ProtectedRoute permiso="testimonios.crear">
            <TestimonyCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/testimonios/:uuid",
        element: (
          <ProtectedRoute permiso="testimonios.editar">
            <TestimonyEdit />
          </ProtectedRoute>
        ),
      },
       {
        path: "mantenimientos/emociones",
        element: (
          <ProtectedRoute permiso="emociones.ver">
            <Emotions />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/emociones/nuevo",
        element: (
          <ProtectedRoute permiso="emociones.crear">
            <EmotionCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/emociones/:uuid",
        element: (
          <ProtectedRoute permiso="emociones.editar">
            <EmotionEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "contenidos/nuevo",
        element: (
          <ProtectedRoute permiso="contenidos.crear">
            <ContentCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "contenidos/lista",
        element: (
          <ProtectedRoute permiso="contenidos.ver">
            <ContentList />
          </ProtectedRoute>
        ),
      },{
        path: "contenidos/:uuid",
        element: (
          <ProtectedRoute permiso="contenidos.editar">
            <ContentEdit />
          </ProtectedRoute>
        ),
      },{
          path: "mantenimientos/avatares",
        element: (
          <ProtectedRoute permiso="contenidos.ver">
            <Avatars />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/avatares/nuevo",
        element: (
          <ProtectedRoute permiso="contenidos.crear">
            <AvatarCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/avatares/:uuid",
        element: (
          <ProtectedRoute permiso="contenidos.editar">
            <AvatarEdit />
          </ProtectedRoute>
        ),
      },
      {
          path: "mantenimientos/marcos",
        element: (
          <ProtectedRoute permiso="contenidos.ver">
            <Backgrounds />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/marcos/nuevo",
        element: (
          <ProtectedRoute permiso="contenidos.crear">
            <BackgroundCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "mantenimientos/marcos/:uuid",
        element: (
          <ProtectedRoute permiso="contenidos.editar">
            <BackgroundEdit />
          </ProtectedRoute>
        ),
      },
      {
  path: "mantenimientos/centros-educativos",
  element: (
    <ProtectedRoute permiso="contenidos.ver">
      <Centers />
    </ProtectedRoute>
  ),
},
{
  path: "mantenimientos/centros-educativos/nuevo",
  element: (
    <ProtectedRoute permiso="contenidos.crear">
      <CenterCreate />
    </ProtectedRoute>
  ),
},
{
  path: "mantenimientos/centros-educativos/:uuid",
  element: (
    <ProtectedRoute permiso="contenidos.editar">
      <CenterEdit />
    </ProtectedRoute>
  ),
}
      
    ],
  },

  { path: "/403", element: <Forbidden /> },
  { path: "*", element: <Navigate to="/" /> },
]);

export default router;
