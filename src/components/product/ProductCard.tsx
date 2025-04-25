// components/product/ProductCard.js
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }) => {
  // Assuming the first color in the array is used for the button style
  const themeColor = product.colors ? product.colors[0] : "gray-900";

  return (
    <Link href={`/category/${product.category.name}/products/${product.id}`} passHref>
      <div className="w-full max-w-xs border border-gray-300 rounded-lg bg-white overflow-hidden">
          <Image
            src={`/uploads${product.images[0].replace('/uploads', '')}`}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-60 object-cover relative block"
            priority
          />
          {product.discount && (
            <span className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded-md">
              {product.discount}% OFF
            </span>
          )}

        <div className="p-4">
          <h5 className="text-lg font-semibold text-gray-900">{product.name}</h5>
          <p className="text-xl font-bold text-gray-900">
            ₦{product.prices[0].toLocaleString()} {/* Add comma formatting */}
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ₦{product.originalPrice.toLocaleString()} {/* Add comma formatting */}
              </span>
            )}
          </p>

          <button
            className={`flex items-center justify-center w-full mt-4 py-2 text-white bg-gray-900 rounded-md hover:bg-${themeColor} transition`}
          >
            Add to Bag
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;