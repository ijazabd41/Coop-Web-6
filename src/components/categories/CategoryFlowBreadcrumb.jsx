import { useSelector } from "react-redux";
import Link from "next/link";

const buildCategoryFlow = (category) => {
  const flow = [];
  let current = category;

  while (current) {
    flow.unshift({
      id: current.id,
      name: current.translations?.name || current.name,
      slug: current.slug,
    });
    current = current.parent || null;
  }

  return flow;
};

const CategoryFlowBreadcrumb = () => {
  const { searchedCategory } = useSelector(
    (state) => state.ProductFilter
  );

  if (!searchedCategory) return null;

  const categoryFlow = buildCategoryFlow(searchedCategory);

  return (
    <div className="flex gap-2 text-sm text-gray-600 mb-3 flex-wrap">
      {categoryFlow.map((cat, index) => (
        <span key={cat.id} className="flex items-center gap-2">
          <Link
            href={`/products?category=${cat.slug}`}
            className="hover:text-primary font-medium"
          >
            {cat.name}
          </Link>
          {index < categoryFlow.length - 1 && <span>→</span>}
        </span>
      ))}
    </div>
  );
};

export default CategoryFlowBreadcrumb;
