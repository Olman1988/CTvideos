export default function Loader({ text = "Cargando..." }) {
  return (
    <div className="loader-container">
      <div className="loader-circle"></div>
      <p className="loader-text">{text}</p>
    </div>
  );
}