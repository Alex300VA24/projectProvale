import { DashboardData, BeneficiariosPageData, FormData } from '@/types';

declare global {
  interface Window {
    __PROVALE_PROPS__?: {
      dashboard?: DashboardData;
      beneficiarios?: BeneficiariosPageData;
      form?: FormData;
    };
  }
}

export type { DashboardData, BeneficiariosPageData, FormData };
