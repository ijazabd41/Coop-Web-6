import { t } from "@/utils/translation";

const PopularBlogTags = ({ tags, setSelectedTag, selectedTag }) => {
  return (
    <div className="w-full p-4 gap-6 border rounded-lg backgroundColor">
      <h2 className="text-xl font-bold underline underline-offset-4 mb-4">
        {t("popular_tags")}
      </h2>

      <div className="flex flex-wrap gap-4">
        {tags.map((tag) => (
          <button
            onClick={() => setSelectedTag(tag?.id)}
            key={tag.id}
            className={`${
              tag?.id == selectedTag
                ? "primaryBackColor text-white"
                : "bodyBackgroundColor textColor"
            }   px-5 py-2 rounded-full  font-medium text-base`}
          >
            {tag?.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularBlogTags;
