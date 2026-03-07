export default function FunChallenges() {
  return (
    <section
      className="fun-section"
      aria-label="Retos divertidos"
      style={{ paddingTop: "150px", paddingBottom: "200px" }}
    >
      <svg
        className="fun-wave"
        viewBox="0 0 1200 70"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,30 C200,60 400,60 600,30 C800,0 1000,0 1200,30 L1200,70 L0,70 Z"
          fill="#6b3f7c"
        />
        <path
          d="M0,36 C200,66 400,66 600,36 C800,6 1000,6 1200,36 L1200,70 L0,70 Z"
          fill="#3e2349"
        />
      </svg>

      {[...Array(10)].map((_, i) => (
        <div key={i} className={`fun-deco ${["one","two","three","four","five","six","seven","eight","nine","ten"][i]} ${["","small","","small","small","xl","","large","small",""][i]}`} aria-hidden="true">
          <img src="images/assets/farol.png" alt="" />
        </div>
      ))}

      <div className="fun-layout">
        <div className="fun-collage">
          <div className="fun-big">
            <img src="images/general/reto1.jpg" alt="Nina escuchando musica" />
          </div>
          <div className="fun-small">
            <img src="images/general/reto2.jpg" alt="Nino sonriendo" />
          </div>
        </div>
        <div className="fun-texts">
          <h2 className="fun-title">Retos divertidos</h2>
          <p className="fun-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet iaculis luctus.
            Mauris lacus mi, ornare vel nulla et, facilisis rutrum velit.
          </p>

          <div className="fun-profiles">
            {[
              { perfil: "perfilreto1.jpg", avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80", name: "Lorem Ipsum" },
              { perfil: "perfilreto2.jpg", avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80", name: "Lorem Ipsum" },
              { perfil: "perfilreto3.jpg", avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80", name: "Lorem Ipsum" },
              { perfil: "perfilreto4.jpg", avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80", name: "Lorem Ipsum" },
            ].map((user, i) => (
              <div key={i} className="fun-profile">
                <img src={`images/general/${user.perfil}`} alt={`Perfil ${i + 1}`} />
                <img className="avatar" src={user.avatar} alt={`Avatar ${i + 1}`} />
                <span>{user.name}</span>
              </div>
            ))}
          </div>

          <div className="fun-row">
            Lorem ipsum it:
            <div className="fun-avatars">
              {[...Array(4)].map((_, i) => (
                <img
                  key={i}
                  src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=80&q=80"
                  alt={`Avatar ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}