/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_THIRDWEB_CLIENT_ID: string
  readonly VITE_FACTORY_ADDRESS: string
  readonly VITE_BUNDLER_URL: string
  readonly VITE_PAYMASTER_URL: string
  readonly VITE_MAIN_ACCOUNT: string
  readonly VITE_ENGINE_URL: string
  readonly VITE_ENGINE_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}