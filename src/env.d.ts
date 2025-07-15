/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly HUBSPOT_ACCESS_TOKEN: string;
  readonly HUBSPOT_PORTAL_ID?: string;
  readonly SITE_URL?: string;
  readonly MONDAY_API_TOKEN?: string;
  readonly FORMSUBMIT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}