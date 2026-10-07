// A mesma camada de regras atende CI sem Next e regressão com servidor.
export const ruleSuites = [
  { name: 'routing', args: ['--test', 'tests/public-host.test.mjs', 'tests/http-test-config.test.mjs', 'tests/qa-config.test.mjs'] },
  ...['client-auth-routing', 'booking-state', 'client-appointments-state', 'client-barbershops-state',
    'barber-demo-state', 'profile-help-state', 'superadmin-state', 'owner-onboarding-state', 'pwa-policy']
    .map(name => ({ name, args: [`../validation/${name}.cjs`] })),
]
