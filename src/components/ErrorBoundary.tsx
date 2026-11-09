import { Component, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useIdioma } from '../i18n/Idioma';
import { AvisoError } from './AvisoError';

interface Props {
  /** Al cambiar, el error se olvida (p. ej. la ruta: ir a otra página lo vuelve a intentar). */
  reinicio: string;
  titulo: string;
  texto: string;
  boton: string;
  /** Si se da, un fallo muestra esto en vez del aviso a página completa (para piezas opcionales). */
  reserva?: ReactNode;
  children: ReactNode;
}

/** Recoge el fallo de un chunk perezoso (red cortada, hashes viejos tras publicar) sin desmontar la raíz. */
class Limite extends Component<Props, { fallo: boolean }> {
  state = { fallo: false };

  static getDerivedStateFromError() {
    return { fallo: true };
  }

  componentDidUpdate(previas: Props) {
    if (this.state.fallo && previas.reinicio !== this.props.reinicio) {
      this.setState({ fallo: false });
    }
  }

  render() {
    if (!this.state.fallo) return this.props.children;
    const { titulo, texto, boton, reserva } = this.props;
    if (reserva !== undefined) return reserva;
    return (
      <AvisoError titulo={titulo} texto={texto} boton={boton} alPulsar={() => location.reload()} />
    );
  }
}

export function ErrorBoundary({ children, reserva }: { children: ReactNode; reserva?: ReactNode }) {
  const { t } = useIdioma();
  const { pathname } = useLocation();
  return (
    <Limite
      reinicio={pathname}
      titulo={t('error.carga.titulo')}
      texto={t('error.carga.texto')}
      boton={t('error.carga.recargar')}
      reserva={reserva}
    >
      {children}
    </Limite>
  );
}
