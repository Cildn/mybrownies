import { NextSeo } from "next-seo";

interface MetaProps {
  title: string;
  description: string;
  image?: string;
}

export default function MetaTags({ title, description, image }: MetaProps) {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        title,
        description,
        images: image ? [{ url: image }] : [],
      }}
    />
  );
}