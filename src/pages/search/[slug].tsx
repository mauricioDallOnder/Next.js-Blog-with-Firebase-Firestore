import { PostCard, PostWidget, Categories } from "@/components";
import { IPostCardProps } from "@/interfaces/interfaces";
import { getPosts } from "@/services";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import Head from 'next/head';
import React from "react";

interface SearchPageProps {
  posts: IPostCardProps[];
  searchTerm: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ posts, searchTerm }) => {
  return (
    <>
    <Head>
    <title>Resultados da busca: {searchTerm}</title>
    <meta name="description" content={`Resultados da busca por ${searchTerm}`} />
    <meta name="keywords" content={searchTerm} />
      </Head>
      <NextSeo
        openGraph={{
          title: `Resultados da busca: {searchTerm}`,
          description: `Resultados da busca por ${searchTerm}`,
          url: `https://cha-com-sabor.vercel.app/search/${searchTerm}`,
          type: "article",
        }}
      />
   
    <main className="container mx-auto px-4 md:px-10 mb-8">
      <section className="bg-white shadow-lg rounded-lg mb-8">
        <div className="bg-[#3399cc] h-[5px]"></div>
        <header className="py-8 px-8 border-b border-gray-200">
          <div className="flex items-center">
            <div className="text-4xl text-gray-700 mr-4" aria-hidden="true">
              <FontAwesomeIcon icon={faFolderOpen} />
            </div>
            <h1 className="text-4xl leading-snug text-gray-800 font-semibold">
              Resultados para a busca: {searchTerm}
            </h1>
          </div>
        </header>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1">
          {posts.map((post) => (
            <article key={post.title}>
              <PostCard {...post} />
            </article>
          ))}
        </div>
        <aside className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            <PostWidget />
            <Categories />
          </div>
        </aside>
      </section>
    </main>
    </>
  );
};

export default SearchPage;

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async (context) => {
  const posts = await getPosts();
  const searchTerm = context.query.slug as string;

  const resultsFiltered = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { props: { posts: resultsFiltered, searchTerm } };
};