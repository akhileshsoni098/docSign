// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  nitro: {
    preset: "vercel",
  },
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    docusignIntegrationKey: process.env.DOCUSIGN_INTEGRATION_KEY,

    docusignClientSecret: process.env.DOCUSIGN_CLIENT_SECRET,

    docusignUserId: process.env.DOCUSIGN_USER_ID,

    docusignAccountId: process.env.DOCUSIGN_ACCOUNT_ID,

    docusignBasePath: process.env.DOCUSIGN_BASE_PATH,

    docusignAuthServer: process.env.DOCUSIGN_AUTH_SERVER,

    docusignPrivateKey: process.env.DOCUSIGN_PRIVATE_KEY,

    public: {
      appUrl: "https://doc-sign-puce.vercel.app" ,
      // appUrl: "http://localhost:3000",
    },
  },
});
