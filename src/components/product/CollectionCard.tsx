import Image from "next/image";
import Link from "next/link";

const CollectionCard = ({ collection }) => {

  return (
    <Link href={`/category/${collection.category.name}/collections/${collection.id}`} passHref>
      <div className="w-full max-w-xs border border-gray-300 rounded-lg bg-white overflow-hidden">
        <Image
          src={`/uploads${collection.images[0].replace('/uploads', '')}`}
          alt={collection.name}
          width={500}
          height={500}
          className="w-full h-60 object-cover relative block"
          priority
        />
        {collection.discount && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded-md">
            {collection.discountRate}% OFF
          </span>
        )}

        <div className="p-4">
          <h5 className="text-lg font-semibold text-gray-900">{collection.name}</h5>
          <p className="text-xl font-bold text-gray-900">
            ₦{collection.price.toLocaleString()}
            {collection.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">₦{collection.originalPrice.toLocaleString()}</span>
            )}
          </p>

          <button
            className="flex items-center justify-center w-full mt-4 py-2 text-white bg-gray-900 rounded-md hover:bg-gray-700 transition"
          >
            Add to Bag

          </button>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;