"use client";

import {
  useEffect,
  useState,
} from "react";


import type {
  Product,
} from "@raze/commerce-sdk";


import {
  useRazeCart,
} from "@raze/commerce-sdk/react";


import {
  raze,
} from "@/lib/raze";


import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";



export default function Home() {


  const [products, setProducts] =
    useState<Product[]>([]);


  const [loading, setLoading] =
    useState(true);



  const {
    items,
  } = useRazeCart();




  useEffect(() => {


    async function loadProducts() {


      try {


        const response =
          await raze.getCatalog();



        setProducts(
          response.products
        );


      }
      catch (error) {


        console.error(
          "Catalog error",
          error
        );


      }
      finally {


        setLoading(false);


      }


    }



    loadProducts();


  }, []);







  return (

    <main

      className="
        min-h-screen
        bg-white
        text-black
      "

    >



      {/* Navbar */}


      <nav

        className="
          border-b
          border-neutral-200
        "

      >


        <div

          className="
            max-w-7xl
            mx-auto
            px-8
            h-20
            flex
            items-center
            justify-between
          "

        >



          <h1

            className="
              text-xl
              font-semibold
              tracking-tight
            "

          >

            RazeStore

          </h1>






          {/* Cart */}


         <CartDrawer />



        </div>


      </nav>









      {/* Products */}


      <section

        className="
          max-w-7xl
          mx-auto
          px-8
          py-20
        "

      >



        <h2

          className="
            text-3xl
            font-semibold
            tracking-tight
          "

        >

          Featured Products

        </h2>







        {
          loading ?


          (

            <p

              className="
                mt-8
                text-neutral-400
              "

            >

              Loading products...

            </p>

          )


          :


          (

            <div

              className="
                mt-8
                grid
                grid-cols-1
                md:grid-cols-3
                gap-8
              "

            >


              {
                products.map(

                  product => (

                    <ProductCard

                      key={
                        product.id
                      }

                      product={
                        product
                      }

                    />

                  )

                )
              }


            </div>

          )

        }





      </section>



    </main>

  );

}