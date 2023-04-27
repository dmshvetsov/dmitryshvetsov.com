class ConfigError extends Error {}

export function getRpcUrl() {
  if (typeof import.meta.env.VITE_RPC_URL === 'undefined') {
    throw new ConfigError('unefined variable VITE_RPC_URL')
  }
  return import.meta.env.VITE_RPC_URL
}
