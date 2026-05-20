// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
     docusignIntegrationKey:
      process.env.DOCUSIGN_INTEGRATION_KEY,

    docusignClientSecret:
      process.env.DOCUSIGN_CLIENT_SECRET,

    docusignUserId:
      process.env.DOCUSIGN_USER_ID,

    docusignAccountId:
      process.env.DOCUSIGN_ACCOUNT_ID,

    docusignBasePath:
      process.env.DOCUSIGN_BASE_PATH,

    docusignAuthServer:
      process.env.DOCUSIGN_AUTH_SERVER,
    public: {
      appUrl: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3000",
    },
  },

  //  css: ['~/assets/css/main.css'],
  //   app: {
  //     head: {
  //       title: 'BrokerDesk — Policy Management',
  //       link: [
  //         { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  //         { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
  //         {
  //           rel: 'stylesheet',
  //           href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap',
  //         },
  //       ],
  //     },
  //   },
});
