const SITE_URL = "https://mashesha.co.za";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// React 19 hoists <title>/<meta>/<link> rendered anywhere in the tree into
// <head> automatically, so each page can just render <SEO> with its own
// tags instead of sharing the one static block in index.html.
function SEO({ title, description, path, noIndex = false, image = DEFAULT_OG_IMAGE }) {
  const url = `${SITE_URL}${path}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Mashesha" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}

export default SEO;
