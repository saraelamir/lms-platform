const images = {
  programming: "/images/programming.jpg",
  "web development": "/images/web.jpg",
  design: "/images/design.jpg",
  marketing: "/images/markting.png",
  business: "/images/markting.png",
};

export const getCategoryImage = (category) => {
  const key = category?.trim().toLowerCase();
  console.log("key:", key);
  console.log("result:", images[key]); 
  return images[key] || "/images/default.jpg";
};
