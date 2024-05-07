import Image from "@11ty/eleventy-img";

let src = "https://images.unsplash.com/photo-1608178398319-48f814d0750c";
let stats = await Image(src, {
  widths: [300],
});

console.log(stats);