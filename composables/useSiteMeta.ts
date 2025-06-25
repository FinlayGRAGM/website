import themeConfig from "~/assets/theme.json";

interface MetaOptions {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  url?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  keywords?: string[];
  canonical?: string;
  locale?: string;
  siteName?: string;
  robots?: string;
  articleAuthor?: string;
  articleSection?: string;
  articleTags?: string[];
}

export default function useSiteMeta(options: MetaOptions = {}) {
  const route = useRoute();

  const constants = useState<any>("site-constants");

  const defaultTitle = computed(() => {
    const constantsValue = constants.value;
    return (
      constantsValue?.site?.title ||
      constantsValue?.contact?.name ||
      "Finlay Graham"
    );
  });

  const defaultDescription = computed(() => {
    const constantsValue = constants.value;
    return (
      constantsValue?.site?.description ||
      constantsValue?.homepage?.description ||
      `${constantsValue?.contact?.name || "Finlay Graham"} is a composer and educator based at ${constantsValue?.contact?.college || "Oberlin College"}.`
    );
  });

  const defaultImage = computed(() => {
    const constantsValue = constants.value;
    return constantsValue?.site?.image || constantsValue?.homepage?.smallPhoto;
  });

  const siteUrl = computed(() => {
    const constantsValue = constants.value;
    return constantsValue?.site?.url || "https://finlaygraham.com";
  });

  const currentUrl = computed(() => `${siteUrl.value}${route.path}`);

  const metaTitle = computed(() => {
    if (!options.title) return defaultTitle.value;
    return `${options.title} | ${defaultTitle.value}`;
  });

  const metaDescription = computed(
    () => options.description || defaultDescription.value,
  );

  const metaImage = computed(() => options.image || defaultImage.value);

  const metaType = options.type || "website";
  const metaUrl = options.url || currentUrl.value;
  const metaLocale = options.locale || "en_US";
  const metaSiteName = computed(() => options.siteName || defaultTitle.value);
  const metaRobots = options.robots || "index, follow";

  const defaultKeywords = computed(() => {
    const constantsValue = constants.value;
    return [
      "composer",
      "music composition",
      "contemporary classical",
      "educator",
      "music teacher",
      constantsValue?.contact?.name?.toLowerCase(),
      constantsValue?.contact?.college?.toLowerCase(),
      "oberlin",
      "classical music",
      "teaching",
      "private lessons",
    ].filter(Boolean);
  });

  const metaKeywords = computed(() =>
    [...defaultKeywords.value, ...(options.keywords || [])].join(", "),
  );

  useSeoMeta({
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    author: computed(() => {
      const constantsValue = constants.value;
      return options.author || constantsValue?.contact?.name;
    }),
    robots: metaRobots,

    ogTitle: metaTitle,
    ogDescription: metaDescription,
    ogImage: metaImage,
    ogUrl: metaUrl,
    ogType: metaType,
    ogSiteName: metaSiteName,
    ogLocale: metaLocale,

    ...(metaType === "article" && {
      articleAuthor: computed(() => {
        const constantsValue = constants.value;
        return options.articleAuthor || constantsValue?.contact?.name;
      }),
      articleSection: options.articleSection || options.section,
      articleTag: options.articleTags || options.tags,
      articlePublishedTime: options.publishedTime,
      articleModifiedTime: options.modifiedTime,
    }),

    twitterTitle: metaTitle,
    twitterDescription: metaDescription,
    twitterImage: metaImage,
  });

  useHead({
    link: [
      {
        rel: "canonical",
        href: options.canonical || metaUrl,
      },
    ],
    meta: [
      {
        name: "theme-color",
        content: themeConfig.colors.primary,
      },
      {
        name: "msapplication-TileColor",
        content: themeConfig.colors.primary,
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "default",
      },
      {
        name: "apple-mobile-web-app-title",
        content: metaTitle.value,
      },
      ...(options.publishedTime
        ? [
            {
              property: "article:published_time",
              content: options.publishedTime,
            },
          ]
        : []),
      ...(options.modifiedTime
        ? [
            {
              property: "article:modified_time",
              content: options.modifiedTime,
            },
          ]
        : []),
    ],
  });

  return {
    title: metaTitle,
    description: metaDescription,
    image: metaImage,
    url: metaUrl,
    keywords: metaKeywords,
    theme: themeConfig,
  };
}
