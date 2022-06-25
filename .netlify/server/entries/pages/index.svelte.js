var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var stdin_exports = {};
__export(stdin_exports, {
  default: () => Routes,
  load: () => load
});
var import_index_13c0de55 = require("../../chunks/index-13c0de55.js");
var import_global_aea828d4 = require("../../chunks/global-aea828d4.js");
var Carousel_svelte_svelte_type_style_lang = "";
var Chat_svelte_svelte_type_style_lang = "";
const Navbar = (0, import_index_13c0de55.c)(($$result, $$props, $$bindings, slots) => {
  return `<nav id="${"header"}" class="${"w-full z-30 top-0 py-1"}"><div class="${"w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-6 py-3"}"><label for="${"menu-toggle"}" class="${"cursor-pointer md:hidden block"}"><svg class="${"fill-current text-gray-900"}" xmlns="${"http://www.w3.org/2000/svg"}" width="${"20"}" height="${"20"}" viewBox="${"0 0 20 20"}"><title>menu</title><path d="${"M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"}"></path></svg></label>
		<input class="${"hidden"}" type="${"checkbox"}" id="${"menu-toggle"}">

		<div class="${"hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1"}" id="${"menu"}"><nav><ul class="${"md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0"}"><li><a class="${"inline-block no-underline hover:text-black hover:underline py-2 px-4"}" href="${"#"}">Shop</a></li>
					<li><a class="${"inline-block no-underline hover:text-black hover:underline py-2 px-4"}" href="${"#"}">About</a></li></ul></nav></div>

		<div class="${"order-1 md:order-2"}"><a class="${"flex items-center tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl "}" href="${"#"}"><svg class="${"fill-current text-gray-800 mr-2"}" xmlns="${"http://www.w3.org/2000/svg"}" width="${"24"}" height="${"24"}" viewBox="${"0 0 24 24"}"><path d="${"M5,22h14c1.103,0,2-0.897,2-2V9c0-0.553-0.447-1-1-1h-3V7c0-2.757-2.243-5-5-5S7,4.243,7,7v1H4C3.447,8,3,8.447,3,9v11 C3,21.103,3.897,22,5,22z M9,7c0-1.654,1.346-3,3-3s3,1.346,3,3v1H9V7z M5,10h2v2h2v-2h6v2h2v-2h2l0.002,10H5V10z"}"></path></svg>
				TIEM8
			</a></div>

		<div class="${"order-2 md:order-3 flex items-center"}" id="${"nav-content"}"><a class="${"inline-block no-underline hover:text-black"}" href="${"#"}"><svg class="${"fill-current hover:text-black"}" xmlns="${"http://www.w3.org/2000/svg"}" width="${"24"}" height="${"24"}" viewBox="${"0 0 24 24"}"><circle fill="${"none"}" cx="${"12"}" cy="${"7"}" r="${"3"}"></circle><path d="${"M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5S14.757 2 12 2zM12 10c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3S13.654 10 12 10zM21 21v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h2v-1c0-2.757 2.243-5 5-5h4c2.757 0 5 2.243 5 5v1H21z"}"></path></svg></a>

			<a class="${"pl-3 inline-block no-underline hover:text-black"}" href="${"#"}"><svg class="${"fill-current hover:text-black"}" xmlns="${"http://www.w3.org/2000/svg"}" width="${"24"}" height="${"24"}" viewBox="${"0 0 24 24"}"><path d="${"M21,7H7.462L5.91,3.586C5.748,3.229,5.392,3,5,3H2v2h2.356L9.09,15.414C9.252,15.771,9.608,16,10,16h8 c0.4,0,0.762-0.238,0.919-0.606l3-7c0.133-0.309,0.101-0.663-0.084-0.944C21.649,7.169,21.336,7,21,7z M17.341,14h-6.697L8.371,9 h11.112L17.341,14z"}"></path><circle cx="${"10.5"}" cy="${"18.5"}" r="${"1.5"}"></circle><circle cx="${"17.5"}" cy="${"18.5"}" r="${"1.5"}"></circle></svg></a></div></div></nav>`;
});
const Product = (0, import_index_13c0de55.c)(($$result, $$props, $$bindings, slots) => {
  let { product } = $$props;
  if ($$props.product === void 0 && $$bindings.product && product !== void 0)
    $$bindings.product(product);
  return `<div class="${"w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col items-center"}"><a${(0, import_index_13c0de55.a)("href", `/product/${product.id}`, 0)}><img class="${"hover:grow hover:shadow-lg"}"${(0, import_index_13c0de55.a)("src", product.image.url, 0)}>
		<div class="${"pt-3 flex items-center justify-between"}"><p class="${"w-52 truncate font-bold text-sm text-center"}">${(0, import_index_13c0de55.e)(product.name)}</p>
			</div>
		<p class="${"pt-1 text-slate-400 text-sm font-bold"}">${(0, import_index_13c0de55.e)(product.price.formatted_with_symbol)}</p></a></div>`;
});
async function load({ fetch }) {
  const req = await fetch(`${import_global_aea828d4.a}/products`);
  const res = await req.json();
  return { props: { products: res.products.data } };
}
const Routes = (0, import_index_13c0de55.c)(($$result, $$props, $$bindings, slots) => {
  let { products } = $$props;
  if ($$props.products === void 0 && $$bindings.products && products !== void 0)
    $$bindings.products(products);
  return `${(0, import_index_13c0de55.v)(Navbar, "Navbar").$$render($$result, {}, {}, {})}


<section class="${"bg-white py-8"}"><div class="${"container mx-auto flex items-center flex-wrap pt-4 pb-12"}">${(0, import_index_13c0de55.b)(products, (product) => {
    return `${(0, import_index_13c0de55.v)(Product, "Product").$$render($$result, { product }, {}, {})}`;
  })}</div></section>

<footer class="${"container mx-auto bg-white py-8 border-t border-gray-400"}"><div class="${"container flex px-3 py-8 "}"><div class="${"w-full mx-auto flex flex-wrap"}"><div class="${"flex w-full lg:w-1/2 "}"><div class="${"px-3 md:px-0"}"><h3 class="${"font-bold text-gray-900"}">About</h3>
					<p class="${"py-4"}">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel mi ut felis tempus
						commodo nec id erat. Suspendisse consectetur dapibus velit ut lacinia.
					</p></div></div>
			<div class="${"flex w-full lg:w-1/2 lg:justify-end lg:text-right"}"><div class="${"px-3 md:px-0"}"><h3 class="${"font-bold text-gray-900"}">Social</h3>
					<ul class="${"list-reset items-center pt-3"}"><li><a class="${"inline-block no-underline hover:text-black hover:underline py-1"}" href="${"#"}">Add social links</a></li></ul></div></div></div></div></footer>
<div class="${"w-1/3 bg-white z-50 "}" style="${"position: fixed; bottom:0; right:0;"}"></div>
<df-messenger intent="${"WELCOME"}" chat-title="${"Online-Shopping"}" agent-id="${"6090d131-0b92-4413-8bee-5a0b9aa6f3e2"}" language-code="${"en"}"></df-messenger>`;
});
module.exports = __toCommonJS(stdin_exports);
