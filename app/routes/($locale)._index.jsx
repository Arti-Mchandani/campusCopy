import { defer } from '@shopify/remix-oxygen';
import { Suspense } from 'react';
import { Await, useLoaderData } from '@remix-run/react';
import { AnalyticsPageType } from '@shopify/hydrogen';

import { ProductSwimlane, CustomCollections, FeaturedCollections, Hero } from '~/components';
import { MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT, custom_PRODUCT_CARD_FRAGMENT } from '~/data/fragments';
import { getHeroPlaceholder } from '~/lib/placeholders';
import { seoPayload } from '~/lib/seo.server';
import { routeHeaders } from '~/data/cache';
import SlickSlider from "../components/SlickSlider"
import ImageWithText from "../components/ImageWithText"
import YoutubeVedio from "../components/YoutubeVedio"
import { concatAST } from 'graphql';
export const headers = routeHeaders;

export async function loader({ params, context }) {
  const { language, country } = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, { status: 404 });
  }

  const { shop, hero } = await context.storefront.query(HOMEPAGE_SEO_QUERY, {
    variables: { handle: 'all' },
  });

  const seo = seoPayload.home();

  return defer({
    shop,
    primaryHero: hero,
    CustomFeaturedProduct: context.storefront.query(CustomFeaturedProduct_query, {
      variables: {
        handles: "modern-statement"
      },
    }),
    // These different queries are separated to illustrate how 3rd party content
    // fetching can be optimized for both above and below the fold.
    featuredProducts: context.storefront.query(
      HOMEPAGE_FEATURED_PRODUCTS_QUERY,
      {
        variables: {
          /**
          * Country and language properties are automatically injected
          * into all queries. Passing them is unnecessary unless you
          * want to override them from the following default:
          */
          country,
          language,
        },
      },
    ),

    secondaryHero: context.storefront.query(COLLECTION_HERO_QUERY, {
      variables: {
        handle: 'backcountry',
        country,
        language,
      },
    }),
    featuredCollections: context.storefront.query(FEATURED_COLLECTIONS_QUERY, {
      variables: {
        country,
        language,
      },
    }),
    SecondFeaturedCollection : context.storefront.query(SecondFeaturedCollection_query),
    CustomCollection: context.storefront.query(CustomCollection_query),
    tertiaryHero: context.storefront.query(COLLECTION_HERO_QUERY, {
      variables: {
        handle: 'winter-2022',
        country,
        language,
      },
    }),
    analytics: {
      pageType: AnalyticsPageType.home,
    },
    seo,
  });
}

export default function Homepage() {
  const {
    primaryHero,
    secondaryHero,
    tertiaryHero,
    featuredCollections,
    featuredProducts,
    CustomFeaturedProduct,
    CustomCollection,
    SecondFeaturedCollection
  } = useLoaderData();
  // TODO: skeletons vs placeholders
  const skeletons = getHeroPlaceholder([{}, {}, {}]);
console.log(SecondFeaturedCollection)
  return (
    <>
     <SlickSlider />
     {CustomCollection && (
        <Suspense>
          <Await resolve={CustomCollection}>
            {({ collections }) => {
              return (<>
                <FeaturedCollections
                  collections={collections}
                  title="Collections"
                  pattern="collections"
                  gap="gapNone"
                  padding="y"
                />
              </>);
            }}
          </Await>
        </Suspense>
      )}
     {CustomFeaturedProduct && (
        <Suspense>
          <Await resolve={CustomFeaturedProduct}>
            {({ collectionByHandle }) => {
              // if (!collections?.nodes) return <></>;
              return (<>
                <ProductSwimlane
                  products={collectionByHandle.products}
                  title="New Arrivalsehvbeu wefweif"
                  count={14}
                />
              </>);
            }}
          </Await>
        </Suspense>
      )}
      <h1>Arti</h1>
      <Suspense>

        <Await resolve={SecondFeaturedCollection}>
          {(data) => {
            return Object.keys(data).map(key => {
       
  
        // Render the FeaturedCollections component with the retrieved data
        return (
          <FeaturedCollections
            collections={data[key]}
            title="Collections"
            pattern="collections"
            gap="gapNone"
            padding="y"
          />
        );
      });
    }}
          </Await>    
            
           </Suspense>

       <ImageWithText />
       <YoutubeVedio />
      {/* {primaryHero && (
        <Hero {...primaryHero} height="full" top loading="eager" />
      )} */}
     
      {/* {secondaryHero && (
<Suspense fallback={<Hero {...skeletons[1]} />}>
<Await resolve={secondaryHero}>
{({hero}) => {
if (!hero) return <></>;
return <Hero {...hero} />;
}}
</Await>
</Suspense>
)}  */}

     


      {/* {tertiaryHero && (
<Suspense fallback={<Hero {...skeletons[2]} />}>
<Await resolve={tertiaryHero}>
{({hero}) => {
if (!hero) return <></>;
return <Hero {...hero} />;
}}
</Await>
</Suspense>
)} */}
    </>
  );
}

const COLLECTION_CONTENT_FRAGMENT = `#graphql
fragment CollectionContent on Collection {
id
handle
title
descriptionHtml
heading: metafield(namespace: "hero", key: "title") {
value
}
byline: metafield(namespace: "hero", key: "byline") {
value
}
cta: metafield(namespace: "hero", key: "cta") {
value
}
spread: metafield(namespace: "hero", key: "spread") {
reference {
...Media
}
}
spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
reference {
...Media
}
}
}
${MEDIA_FRAGMENT}
`;

const HOMEPAGE_SEO_QUERY = `#graphql
query seoCollectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
@inContext(country: $country, language: $language) {
hero: collection(handle: $handle) {
...CollectionContent
}
shop {
name
description
}
}
${COLLECTION_CONTENT_FRAGMENT}
`;

const COLLECTION_HERO_QUERY = `#graphql
query heroCollectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
@inContext(country: $country, language: $language) {
hero: collection(handle: $handle) {
...CollectionContent
}
}
${COLLECTION_CONTENT_FRAGMENT}
`;

// @see: https://shopify.dev/api/storefront/2023-04/queries/products
export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
@inContext(country: $country, language: $language) {
  
    products(first: 10) {
      nodes {
        ...ProductCard
      }
    }
  }
  
${PRODUCT_CARD_FRAGMENT}
`;
// 1, query: "title:hair_straight"
export const CustomCollection_query = `#graphql
query abc {
  collections(
    first: 4
    query: "(title:Men's Sports Shoes) OR (title:Men's Sneakers) OR (title:JUSTICE LEAGUE) OR (title:Chunky Sneakers)"
  ) {
    nodes {
      id
      title
      handle
      image {
        altText
        width
        height
        url
      }
    }
  }
}

`;
export const SecondFeaturedCollection_query = `#graphql
query second_featured {
  collections_1: collections(first: 1, query: "title:Men's Sports Shoes") {
    nodes {
      id
      title
      handle
      image {
        altText
        width
        height
        url
      }
    }
  }
  collections_2: collections(first: 1, query: "title:Air Capsule") {
    nodes {
      id
      title
      handle
      image {
        altText
        width
        height
        url
      }
    }
  }
}

`
export const CustomFeaturedProduct_query = `#graphql
query xyz($handles: String!) {
  collectionByHandle(handle: $handles) {
    description
    products(first: 14) {
      nodes {
        ...product_card_option
      }
    }
  }
}

${custom_PRODUCT_CARD_FRAGMENT}
`;
// ???????????????? difference in between
// export const CustomFeaturedProduct = `#graphql
// query customFeaturedCollections($country: CountryCode, $language: LanguageCode)
// // @inContext(country: $country, language: $language) {
// collectionByHandle(handle: "modern-statement") {
// description
// products(first: 4) {
// nodes {
// images(first:2) {
// nodes {
// url
// }
// }
// }
// }
// }
// }
// `;
// @see: https://shopify.dev/api/storefront/2023-04/queries/collections
export const FEATURED_COLLECTIONS_QUERY = `#graphql
query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode)
@inContext(country: $country, language: $language) {
  collections(first: 4, sortKey: UPDATED_AT) {
    nodes {
      id
      title
      handle
      image {
        altText
        width
        height
        url
      }
    }
  }
}
`;

