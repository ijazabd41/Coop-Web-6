const fs = require('fs');

const path = 'src/components/layout/Header.jsx';
let content = fs.readFileSync(path, 'utf8');

// The layout the user wants:
// [Logo] [Location Selector] [Centered Navigation Menu] [Cart Section] [Profile Section]

// 1. Fix line 392: remove 'columns-3' and add 'gap-4' and 'flex-nowrap' if necessary
content = content.replace(
  'px-2 flex justify-between items-center pb-[8px] md:py-[12px] lg:py-4 columns-3 border-b-2  md:border-none py-2',
  'px-2 flex justify-between items-center pb-[8px] md:py-[12px] lg:py-4 lg:gap-4 border-b-2 md:border-none py-2 w-full'
);

// 2. Fix Logo wrapper:
content = content.replace(
  'className="  relative order-2 lg:order-1 h-[60px] lg:h-[80px] w-[210px] lg:w-[280px]"',
  'className="relative order-2 lg:order-1 h-[60px] lg:h-[80px] w-[210px] lg:w-[280px] flex items-center flex-shrink-0"'
);

// 3. Fix Location and Navigation logic:
// Currently they are wrapped in:
// <div className="hidden lg:flex items-center gap-10 order-2">
//   <div className="hidden md:flex gap-2 items-center cursor-pointer" onClick={handleOpenLocation}>...</div>
//   <ul className="flex gap-10 items-center">...</ul>
// </div>
// We need to split them so navigation can take `flex-1` and center its items.
content = content.replace(
  '<div className="hidden lg:flex items-center gap-10 order-2">',
  '<!--SPLIT_MARKER_1-->'
);

// find where that div closes. We know there is an ul right after the location div.
// The structure is:
// <!--SPLIT_MARKER_1-->
//   <div className="hidden md:flex gap-2 items-center cursor-pointer" onClick={handleOpenLocation}>
//      ...
//   </div>
//   <ul className="flex gap-10 items-center">
//     ...
//   </ul>
// </div>

content = content.replace(
  '<!--SPLIT_MARKER_1-->\n                <div\n                  className="hidden md:flex gap-2 items-center cursor-pointer"\n                  onClick={handleOpenLocation}\n                >',
  '<div className="hidden lg:flex items-center gap-4 order-2 flex-shrink-0"\n                  onClick={handleOpenLocation}\n                >'
);

// Find the ul tag and replace its wrapper
content = content.replace(
  '<ul className="flex gap-10 items-center">',
  '</div>\n              <div className="hidden lg:flex flex-1 items-center justify-center order-3">\n                <ul className="flex gap-8 items-center justify-center">'
);

// Find the closing div for the old wrapper right before the mobile hamburger
// It looks like:
//                   </Link>\n                </ul>\n              </div>\n              <div className="flex sm:order-1 md:order-1 lg:hidden hover:cursor-pointer">
content = content.replace(
  '</Link>\n                </ul>\n              </div>\n              <div className="flex sm:order-1 md:order-1 lg:hidden hover:cursor-pointer">',
  '</Link>\n                </ul>\n              </div>\n              <div className="flex sm:order-1 lg:hidden hover:cursor-pointer flex-shrink-0">'
);

// 4. Cart and Profile section
// Currently: <div className=" gap-4 order-3 hidden md:flex lg:flex ">
content = content.replace(
  '<div className=" gap-4 order-3 hidden md:flex lg:flex ">',
  '<div className="gap-6 order-4 hidden lg:flex items-center flex-shrink-0">'
);

// In the cart section, ensure "flex items-center gap-2" becomes "flex items-center gap-3"
content = content.replace(
  '<div\n                  className="flex items-center gap-2 cursor-pointer"\n                  onClick={handleCartOpen}\n                >',
  '<div\n                  className="flex items-center gap-3 cursor-pointer"\n                  onClick={handleCartOpen}\n                >'
);

// Cart icon padding logic
content = content.replace(
  '<span className="p-3 iconBackgroundColor rounded-full relative">',
  '<span className="p-3 iconBackgroundColor rounded-full relative flex items-center justify-center">'
);

// Fix vertical alignment for text
content = content.replace(
  '<div className="flex flex-col ">',
  '<div className="flex flex-col justify-center">'
);

// Profile logic alignment
content = content.replace(
  '<DropdownMenuTrigger className="flex items-center border-none outline-none gap-2 p-0 shadow-none font-bold text-base ">',
  '<DropdownMenuTrigger className="flex items-center border-none outline-none gap-3 p-0 shadow-none font-bold text-base ">'
);

content = content.replace(
  '<span className="p-3 iconBackgroundColor rounded-full">',
  '<span className="p-3 iconBackgroundColor rounded-full flex items-center justify-center">'
);

// For the login wrapper if not logged in
content = content.replace(
  '<div\n                    className="flex gap-2 items-center cursor-pointer"\n                    onClick={handleLoginOpen}\n                  >',
  '<div\n                    className="flex gap-3 items-center cursor-pointer"\n                    onClick={handleLoginOpen}\n                  >'
);
content = content.replace(
  '<div className="flex ">\n                      <span className="text-base font-bold">{t("login")}</span>\n                    </div>',
  '<div className="flex items-center">\n                      <span className="text-base font-bold">{t("login")}</span>\n                    </div>'
);

// Mobile cart wrapper
content = content.replace(
  '<div className="flex md:hidden gap-2 order-3 items-center">',
  '<div className="flex lg:hidden gap-4 order-5 items-center flex-shrink-0">'
);

fs.writeFileSync(path, content, 'utf8');
console.log("Header fixed!");
