import { usePageLoading } from "@/context/PageLoadingContext";

export default function PageLoader() {

  const { loading } = usePageLoading();

  if (!loading) return null;

  return (
    <div className="page-loader">
      <div className="spinner"></div>
      <p>Cargando página...</p>
    </div>
  );
}