import { GetStaticPaths, GetStaticProps } from "next";
import { IPostCardProps } from "@/interfaces/interfaces";
import { getCategories, getPostsByCategory } from "@/services";
import { Categories, PostCard, PostWidget } from "@/components";
import CategoriesHeader from "@/components/CategoriesHeader";
import { NextSeo } from "next-seo";
import { useState } from "react";

const POSTS_PER_PAGE = 5;
export default function CategoryPage({
  posts,
  selectedCategory,
}: {
  posts: IPostCardProps[];
  selectedCategory: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  return (
    <>
     
      <NextSeo
        openGraph={{
          title: selectedCategory,
          description: `Posts sobre ${selectedCategory}`,
          url: `https://cha-com-sabor.vercel.app/categorias/${selectedCategory}`,
          type: "article",
        }}
      />
      <main className="container mx-auto px-10 mb-8">
      
        <section>
          {selectedCategory && (
            <CategoriesHeader name={selectedCategory!} />
          )}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 col-span-1">
              {paginatedPosts.map((post, index) => (
                <PostCard key={index} {...post} />
              ))}
            </div>
            <aside className="lg:col-span-4 col-span-1">
              <div className="lg:sticky relative top-8">
                <PostWidget />
                <Categories />
              </div>
            </aside>
          </div>
        </section>
        {/* Controles de paginação */}

        <section className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`text-center py-3 px-3 cursor-pointer bg-pink-600 rounded-full 
      ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
             <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6  text-white w-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <span className="text-lg font-semibold text-white">
            página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`text-center py-3 px-3 cursor-pointer bg-pink-600 rounded-full 
      ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          >
             <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6  text-white w-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getCategories();

  // Filtrar a categoria "todos-os-artigos"
  const filteredCategories = categories.filter(
    (category) => category.slug !== "todos-os-artigos"
  );

  const paths = filteredCategories.map((category) => ({
    params: { slug: category.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;

  // Se slug for "todos-os-artigos", redirecione para a página inicial
  if (slug === "todos-os-artigos") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const allPosts = await getPostsByCategory(slug);

  const posts = allPosts.filter((post) =>
    post.categories.some((category) => category.slug === slug)
  );

  return { props: { posts, selectedCategory: slug } };
};
