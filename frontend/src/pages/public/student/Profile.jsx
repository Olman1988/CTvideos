import ProfileStudent from "./ProfileStudent";
import ProfileTutor from "./ProfileTutor";
import ProfileGuardian from "./ProfileGuardian";

export default function Profile() {

  const user = JSON.parse(localStorage.getItem("user")) || {};

  if(user?.perfiles?.estudiante){
    return <ProfileStudent user={user} />;
  }

  if(user?.perfiles?.tutor){
    return <ProfileTutor user={user} />;
  }

  if(user?.perfiles?.encargado){
    return <ProfileGuardian user={user} />;
  }

  return <div>Perfil no encontrado</div>;
}