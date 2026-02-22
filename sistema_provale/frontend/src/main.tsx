import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { getPropsFromElement } from '@/utils';

const REACT_APPS = {
  'dashboard-root': () => import('@/pages/DashboardApp'),
  'beneficiarios-root': () => import('@/pages/BeneficiariosApp'),
  'beneficiario-form-root': () => import('@/pages/BeneficiarioFormApp'),
  'auth-root': () => import('@/pages/AuthApp'),
  'socios-root': () => import('@/pages/SociosApp'),
  'club-madres-root': () => import('@/pages/ClubMadresApp'),
  'reconocimientos-root': () => import('@/pages/ReconocimientosApp'),
  'productos-root': () => import('@/pages/ProductosApp'),
  'movimientos-root': () => import('@/pages/MovimientosApp'),
  'pecosas-root': () => import('@/pages/PecosasApp'),
  'perfil-root': () => import('@/pages/PerfilApp'),
};

function mountApps() {
  Object.entries(REACT_APPS).forEach(([elementId, loadApp]) => {
    const rootElement = document.getElementById(elementId);
    if (!rootElement) return;

    const props = getPropsFromElement(elementId);
    
    loadApp().then(({ default: App }) => {
      createRoot(rootElement).render(
        <StrictMode>
          <App {...(props as any)} />
        </StrictMode>
      );
    }).catch(console.error);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApps);
} else {
  mountApps();
}
