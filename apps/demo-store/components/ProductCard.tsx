import type {
  Product,
} from "@raze/commerce-sdk";


export default function ProductCard({
  product,
}:{
  product:Product;
}){

return (

<div
className="
group
border
border-neutral-200
rounded-3xl
p-5
bg-white
transition
hover:-translate-y-1
hover:shadow-xl
"
>


<div
className="
h-44
rounded-2xl
bg-neutral-100
flex
items-center
justify-center
text-neutral-400
text-sm
"
>
Image
</div>



<div className="mt-5">


<p
className="
text-xs
uppercase
tracking-widest
text-neutral-400
"
>
{product.category ?? "Product"}
</p>



<h3
className="
mt-2
text-lg
font-medium
"
>
{product.name}
</h3>



<p
className="
mt-2
text-sm
text-neutral-500
"
>
{product.description}
</p>



<div
className="
mt-5
flex
justify-between
items-center
"
>


<span
className="
font-semibold
"
>
₹{product.price}
</span>



<button
className="
rounded-full
bg-black
text-white
px-5
py-2
text-sm
"
>
Add
</button>


</div>


</div>


</div>

);

}