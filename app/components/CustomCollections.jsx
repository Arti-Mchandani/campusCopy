

import {Image} from '@shopify/hydrogen';
import {Heading, Section, Grid, Link} from '~/components';

export  function CustomCollections({
  collections,
  title = 'Collections',
  ...props
}) {
//   const haveCollections = collections?.nodes?.length > 0;
//   if (!haveCollections) return null;

//   const collectionsWithImage = collections.nodes.filter((item) => item.image);
console.log(collections)
  return (
    <Section {...props} heading={title}>
      <Grid >
        {/* {collectionsWithImage.map((collection) => {
          return (
            <Link key={collection.id} to={`/collections/${collection.handle}`}>
              <div className="grid gap-4">
                <div className="card-image bg-primary/5 aspect-[3/2]">
                  {collection?.image && (
                    <Image
                      alt={`Image of ${collection.title}`}
                      data={collection.image}
                      sizes="(max-width: 32em) 100vw, 33vw"
                      aspectRatio="3/2"
                    />
                  )}
                </div>
                <Heading size="copy">{collection.title}</Heading>
              </div>
            </Link>
          );
        })} */}
        <p>{collections.handle}</p>-----
        <Image src={collections.image.url} />
      </Grid>
    </Section>
  );
}
