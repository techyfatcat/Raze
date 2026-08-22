"use client";

import { useEffect, useState } from "react";
import type { Product } from "@raze/commerce-sdk";
import { raze } from "@/lib/raze";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await raze.getCatalog();

        setProducts(response.products);
      } catch (error) {
        console.error("Failed loading products", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">

      <nav className="
        border-b
        border-neutral-200
      ">
        <div className="
          max-w-7xl
          mx-auto
          px-8
          h-20
          flex
          items-center
          justify-between
        ">

          <h1 className="
            text-xl
            font-semibold
            tracking-tight
          ">
            RazeStore
          </h1>


          <div className="
            flex
            items-center
            gap-8
            text-sm
            text-neutral-500
          ">
            <span>
              Products
            </span>

            <span>
              Cart
            </span>


            <button
              className="
                rounded-full
                bg-black
                px-4
                py-2
                text-white
                text-xs
              "
            >
              AI Assistant
            </button>

          </div>

        </div>
      </nav>

      <section className="
        max-w-7xl
        mx-auto
        px-8
        pt-16
        pb-10
      ">

        <div>

          <p className="
            text-xs
            uppercase
            tracking-[0.2em]
            text-neutral-400
          ">
            Powered by Raze AI Commerce
          </p>


          <h2 className="
            mt-5
            text-4xl
            font-semibold
            tracking-tight
          ">
            Featured Collection
          </h2>

        </div>

      </section>

      <section className="
        max-w-7xl
        mx-auto
        px-8
        pb-24
      ">

        {loading ? (

          <p className="text-neutral-500">
            Loading products...
          </p>

        ) : products.length === 0 ? (

          <p className="text-neutral-500">
            No products available.
          </p>

        ) : (

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
          ">

            {products.map((product) => (

              <div
                key={product.id}
                className="
                  group
                  border
                  border-neutral-200
                  rounded-3xl
                  bg-white
                  p-5
                  transition
                  hover:shadow-xl
                "
              >
                <div className="
                  h-56
                  rounded-2xl
                  bg-neutral-100
                  flex
                  items-center
                  justify-center
                  text-sm
                  text-neutral-400
                ">
                  Product Image
                </div>



                <div className="mt-6">

                  <p className="
                    text-xs
                    uppercase
                    tracking-wide
                    text-neutral-400
                  ">
                    {product.category ?? "Product"}
                  </p>


                  <h3 className="
                    mt-2
                    text-xl
                    font-medium
                  ">
                    {product.name}
                  </h3>


                  <p className="
                    mt-3
                    text-sm
                    text-neutral-500
                    line-clamp-2
                  ">
                    {product.description ??
                      "Premium product available through Raze"}
                  </p>



                  <div className="
                    mt-6
                    flex
                    items-center
                    justify-between
                  ">

                    <span className="
                      font-semibold
                    ">
                      Rs. {product.price}
                    </span>


                    <button
                      className="
                        rounded-full
                        bg-black
                        px-5
                        py-2
                        text-sm
                        text-white
                        transition
                        hover:bg-neutral-800
                      "
                    >
                      Add
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      <div className="
        fixed
        bottom-8
        right-8
        w-80
        rounded-3xl
        border
        border-neutral-200
        bg-white
        shadow-2xl
        p-5
      ">

        <div className="
          flex
          items-center
          justify-between
        ">

          <h3 className="
            font-medium
          ">
            Raze AI
          </h3>


          <span className="
            text-xs
            text-neutral-400
          ">
            Online
          </span>

        </div>


        <p className="
          mt-4
          text-sm
          text-neutral-500
        ">
          Need help finding the right product?
          Ask Raze anything.
        </p>


        <button
          className="
            mt-4
            w-full
            rounded-xl
            bg-black
            py-3
            text-sm
            text-white
          "
        >
          Start conversation
        </button>

      </div>


    </main>
  );
}