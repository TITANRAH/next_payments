"use client";
import { Product, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui";
import { useCartStore } from "@/store/cartStore";

interface Props {
  product: Product & {
    author: User;
  };
}

function ProductCard({ product }: Props) {
  const router = useRouter();
  // llamo a la funcion que añade al carro
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div
      key={product.id}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
      <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
        <Image
          src={product?.image || ""}
          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
          alt={product.name}
          width={300}
          height={300}
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            <a href="#">{product.name}</a>
          </h3>
          <div>
            <Image
              className="inline-block h-12 w-12 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
              width={48}
              height={48}
            />
            <span>{product.author.name}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">{product.description}</p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-sm italic text-gray-500">{product.stock}</p>
          <p className="text-base font-medium text-gray-900">{product.price}</p>
          <Button
          disabled={product.stock === 0}
            onClick={async () => {
              addToCart(product);

              // llamamos a la funcion creada en esta ruta
            // const result = await fetch('/api/checkout',{
            //     method: 'POST'
            //   })
            //   // console.log('comprar')

            //   const data = await result.json()

            //   window.location.href = data.url

            //   console.log({data})
            }}
          >
            Añadir al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
