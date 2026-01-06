interface PersonSchema {
  name: string;
  jobTitle?: string;
  description?: string;
  url?: string;
  image?: string;
  email?: string;
  affiliation?: string;
  alumniOf?: string[];
  knowsAbout?: string[];
  sameAs?: string[];
}

interface OrganizationSchema {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    contactType: string;
    email?: string;
    telephone?: string;
  };
}

interface ArticleSchema {
  headline: string;
  description?: string;
  author: string | PersonSchema;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  url?: string;
  articleSection?: string;
  keywords?: string[];
}

interface WebPageSchema {
  name: string;
  description?: string;
  url?: string;
  image?: string;
  author?: string | PersonSchema;
  publisher?: OrganizationSchema;
  datePublished?: string;
  dateModified?: string;
}

type StructuredDataType = 'Person' | 'Organization' | 'Article' | 'WebPage' | 'CreativeWork' | 'MusicComposition';

interface StructuredDataOptions {
  type: StructuredDataType;
  data: PersonSchema | OrganizationSchema | ArticleSchema | WebPageSchema | any;
}

export default function useStructuredData(options: StructuredDataOptions) {
  const route = useRoute();
  const constants = useState<any>('site-constants');
  
  const baseUrl = 'https://finlaygraham.com';
  const currentUrl = `${baseUrl}${route.path}`;
  
  const createPersonSchema = (data: PersonSchema) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.jobTitle || 'Composer & Educator',
    description: data.description,
    url: data.url || baseUrl,
    image: data.image,
    email: data.email,
    affiliation: data.affiliation && {
      '@type': 'Organization',
      name: data.affiliation
    },
    alumniOf: data.alumniOf?.map(school => ({
      '@type': 'Organization',
      name: school
    })),
    knowsAbout: data.knowsAbout,
    sameAs: data.sameAs
  });
  
  const createOrganizationSchema = (data: OrganizationSchema) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    contactPoint: data.contactPoint
  });
  
  const createArticleSchema = (data: ArticleSchema) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    author: typeof data.author === 'string' ? {
      '@type': 'Person',
      name: data.author
    } : data.author,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    image: data.image,
    url: data.url || currentUrl,
    articleSection: data.articleSection,
    keywords: data.keywords
  });
  
  const createWebPageSchema = (data: WebPageSchema) => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.name,
    description: data.description,
    url: data.url || currentUrl,
    image: data.image,
    author: typeof data.author === 'string' ? {
      '@type': 'Person',
      name: data.author
    } : data.author,
    publisher: data.publisher,
    datePublished: data.datePublished,
    dateModified: data.dateModified
  });
  
  const createMusicCompositionSchema = (data: any) => ({
    '@context': 'https://schema.org',
    '@type': 'MusicComposition',
    name: data.name,
    description: data.description,
    composer: {
      '@type': 'Person',
      name: data.composer || constants.value?.contact?.name || 'Finlay Graham'
    },
    dateCreated: data.dateCreated,
    genre: data.genre,
    duration: data.duration,
    musicalKey: data.musicalKey,
    url: data.url || currentUrl
  });
  
  let schema;
  
  switch (options.type) {
    case 'Person':
      schema = createPersonSchema(options.data as PersonSchema);
      break;
    case 'Organization':
      schema = createOrganizationSchema(options.data as OrganizationSchema);
      break;
    case 'Article':
      schema = createArticleSchema(options.data as ArticleSchema);
      break;
    case 'WebPage':
      schema = createWebPageSchema(options.data as WebPageSchema);
      break;
    case 'MusicComposition':
      schema = createMusicCompositionSchema(options.data);
      break;
    default:
      schema = {
        '@context': 'https://schema.org',
        '@type': options.type,
        ...options.data
      };
  }
  
  // Add the structured data to the page head
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema, null, 2)
      }
    ]
  });
  
  return schema;
} 