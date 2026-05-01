// Category and Subcategory data structure

export const CATEGORIES = {
  TOPWEAR: "Topwear",
  BOTTOMWEAR: "Bottomwear",
  FOOTWEAR: "Footwear",
  ACCESSORIES: "Accessories",
};

export const CATEGORIES_DATA = [
  {
    name: CATEGORIES.TOPWEAR,
    description: "Shirts, T-Shirts, Jackets & More",
    imageUrl:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRPOj_lUlfregeYA8Xv-MtqLx3-CE2BgfmYaFKrt5ImqzsScxE15YmBLeafJ7xfwDXJ-N5YhCuM_KPF1Ef7d7LIZsuReNQhzn8OLr7B0hEUuZxuzcCwAKzl",
    gradientFrom: "from-blue-100/90",
    gradientTo: "to-blue-200/90",
  },
  {
    name: CATEGORIES.BOTTOMWEAR,
    description: "Jeans, Chinos, Shorts & More",
    imageUrl:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTFAPQ4NjGGConMrkqMI00b9oCg_29PuFFDy1TzJvXe3SC4aqYGoiHNeLlCHvJEBZ9_dNNDYpO8WuXrbD2wEST1z7QiC1-1G3zZHpilPVT0xAlaSZQJgDXH",
    gradientFrom: "from-green-100/90",
    gradientTo: "to-green-200/90",
  },
  {
    name: CATEGORIES.FOOTWEAR,
    description: "Sneakers, Formal, Boots & More",
    imageUrl:
      "https://images.unsplash.com/photo-1593081891731-fda0877988da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fG5pa2V8ZW58MHwxfDB8fHww",
    gradientFrom: "from-purple-100/90",
    gradientTo: "to-purple-200/90",
  },
  {
    name: CATEGORIES.ACCESSORIES,
    description: "Belts, Watches, Bags & More",
    imageUrl:
      "https://images.unsplash.com/photo-1624811742200-69166e7b7bcc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHBlcmZ1bWV8ZW58MHwxfDB8fHww",
    gradientFrom: "from-orange-100/90",
    gradientTo: "to-orange-200/90",
  },
];

export const SUBCATEGORIES = {
  [CATEGORIES.TOPWEAR]: [
    {
      name: "Shirts",
      image:
        "https://images.unsplash.com/photo-1603252110971-b8a57087be18?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNoaXJ0fGVufDB8MHwwfHx8MA%3D%3D",
    },
    {
      name: "T-Shirts",
      image:
        "https://plus.unsplash.com/premium_photo-1718913931807-4da5b5dd27fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dCUyMHNoaXJ0c3xlbnwwfDB8MHx8fDA%3D",
    },
    {
      name: "Jackets",
      image:
        "https://images.unsplash.com/photo-1706765779494-2705542ebe74?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amFja2V0c3xlbnwwfDB8MHx8fDA%3D",
    },
    {
      name: "Sweaters",
      image:
        "https://plus.unsplash.com/premium_photo-1758839789830-23ed31552719?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fHN3ZWF0ZXJzfGVufDB8MHwwfHx8MA%3D%3D",
    },
    {
      name: "Sweatshirts",
      image:
        "https://images.unsplash.com/photo-1607160199580-1b0c9b736b66?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzl8fHN3ZWF0c2hpcnRzfGVufDB8fDB8fHww",
    },
    {
      name: "Hoodies",
      image:
        "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9vZGllfGVufDB8MHwwfHx8MA%3D%3D",
    },
    {
      name: "Kurta",
      image:
        "https://images.unsplash.com/photo-1622780432053-767528938f34?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a3VydGF8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Blazers",
      image:
        "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJsYXplcnxlbnwwfHwwfHx8MA%3D%3D",
    },
  ],
  [CATEGORIES.BOTTOMWEAR]: [
    {
      name: "Jeans",
      image:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQGCxiHt__5HwW8LwqA5qCv_zFX-bf1oPF2GnDyt20R8d7fdsWv3s_1xOCdlE6taPCtorTPT-VUq1ffGD1JHvJMefxXe4XS7mcfbdK-HAtLIcJFQtUBlHce",
    },
    {
      name: "Chinos",
      image:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRatRhO1O2qlzu-Fb2MVrr_wEDsWXflKtTi_punhTcW2J69P__ki0m9FL2J-nFIPHIAtZcpe0V8m2imRvRGBBnRxiHSYJRIJuJ7nhR_uDc",
    },
    {
      name: "Shorts",
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS85gMSebII93Amb8PeO_TEASuwWzuOoUpz5qu37H7wVy5M_Y39GmXtiDIerALddYW_xJx4N-U4aXQI2zyKm-fnGgb4gfPy9v7t_cnRRxc",
    },
    {
      name: "Track Pants",
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR6sTfNbrYdjL-bnqOV30Qdmah5RPxi3fF9ntOIjgcKU4utSxBjjyOi1Eksl3LcpLJ2YAyY2LzECVPabND2Di01_uBzSzwBkJ6LsXnd_nmPPUB3LsHI5lL1",
    },
    {
      name: "Trousers",
      image:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS0ppREcRmpGL3RbiFMIld2uueos_EPhqJtKghOiO7_gOHxO4I1LtgoENFZ90iwQMPaWCC6msfSBsbqR_ljfFzU_hoE8ULjYmG4-z6E6bly8c-b8RsHIAqL",
    },
    {
      name: "Cargo",
      image:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT8Ua4NrKNwqDWaW1CNGqz2xw3-GJwV9UKssCy7mnyuPX_jGHHm9ujAqIKV6yuG1r-4QTfZUIrNVM6_z9u-fUsCMPto9vbQzM35uM2DHVcD_0dMnxdOMvsa3w",
    },
    {
      name: "Joggers",
      image:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQX45OA9NEYf1ojW0PwhyP5VoxJ43W_0WfG4gnr6hJm610p9N0zef_QYXe7gQSAYQbp7bWa78TqD6Zy4-m-RoLWDem_xllpFvoD1OyRHCf5",
    },
  ],
  [CATEGORIES.FOOTWEAR]: [
    {
      name: "Sneakers",
      image:
        "https://images.unsplash.com/photo-1603787081207-362bcef7c144?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25lYWtlcnxlbnwwfDF8MHx8fDA%3D",
    },
    {
      name: "Formal",
      image:
        "https://plus.unsplash.com/premium_photo-1664790560167-5160505f1596?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZvcm1hbCUyMHNob2VzfGVufDB8MXwwfHx8MA%3D%3D",
    },
    {
      name: "Sandals",
      image:
        "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FuZGFsfGVufDB8MXwwfHx8MA%3D%3D",
    },
    {
      name: "Boots",
      image:
        "https://plus.unsplash.com/premium_photo-1729285270693-3131f27a56c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGJvb3RzfGVufDB8MXwwfHx8MA%3D%3D",
    },
    {
      name: "Loafers",
      image:
        "https://images.unsplash.com/photo-1615979474401-8a6a344de5bd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8",
    },
    {
      name: "Flip Flops",
      image:
        "https://images.unsplash.com/photo-1622920799137-86c891159e44?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmxpcCUyMGZsb3BzfGVufDB8MXwwfHx8MA%3D%3D",
    },
    {
      name: "Sports Shoes",
      image:
        "https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmlrZSUyMHNob2VzfGVufDB8MXwwfHx8MA%3D%3D",
    },
    {
      name: "Running Shoes",
      image:
        "https://images.unsplash.com/photo-1621315271772-28b1f3a5df87?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  [CATEGORIES.ACCESSORIES]: [
    {
      name: "Belts",
      image:
        "https://images.unsplash.com/photo-1666723043169-22e29545675c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVsdHxlbnwwfDF8MHx8fDA%3D",
    },
    {
      name: "Watches",
      image:
        "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdhdGNofGVufDB8MXwwfHx8MA%3D%3D",
    },
    {
      name: "Bags",
      image:
        "https://images.unsplash.com/photo-1621609764049-5ee1db3d7c35?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D",
    },
    {
      name: "Hats",
      image:
        "https://images.unsplash.com/photo-1647528458336-c0eb575af956?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
    },
    {
      name: "Ties",
      image:
        "https://plus.unsplash.com/premium_photo-1723924810262-c67a0950f311?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDh8fHxlbnwwfHx8fHw%3D",
    },
    {
      name: "Perfumes",
      image:
        "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlcmZ1bWV8ZW58MHwxfDB8fHww",
    },
    {
      name: "Sunglasses",
      image:
        "https://images.unsplash.com/photo-1599705709640-9f9eb5964485?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHN1bmdsYXNzZXN8ZW58MHwxfDB8fHww",
    },
    {
      name: "Chains",
      image:
        "https://images.unsplash.com/photo-1708220040823-7171b8369b38?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Bracelets",
      image:
        "https://images.unsplash.com/photo-1742402512243-d077e1c5214f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fG1lbiUyMGJyYWNlbGV0fGVufDB8MXwwfHx8MA%3D%3D",
    },
    {
      name: "Rings",
      image:
        "https://media.istockphoto.com/id/1071665154/photo/gemstone.webp?a=1&b=1&s=612x612&w=0&k=20&c=5hTYL4931ZP4IOxK6d9BJH7eiyKd9OmkqjeadQMFAzA=",
    },
  ],
};

export const TYPES = ["Casual", "Formal", "Activewear", "Ethnic", "Party"];

export const OCCASIONS = ["Casual", "Work", "Party", "Formal", "Sports"];

export const SEASONS = ["Summer", "Winter", "Spring", "Fall", "All Season"];

export const CURRENCIES = {
  INR: "INR",
  USD: "USD",
  EUR: "EUR",
};

// Dashboard stat card configuration
export const DASHBOARD_STATS = [
  {
    key: "items",
    label: "Total Products",
    icon: "ShoppingBag",
    color:
      "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900",
    accent: "text-indigo-600 dark:text-indigo-300",
  },
  {
    key: "favorites",
    label: "Favorites",
    icon: "Heart",
    color:
      "bg-gradient-to-br from-pink-50 to-rose-100 dark:from-gray-800 dark:to-gray-900",
    accent: "text-rose-600 dark:text-rose-300",
  },
  {
    key: "outfits",
    label: "Outfits Created",
    icon: "Sparkles",
    color:
      "bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-800 dark:to-gray-900",
    accent: "text-violet-600 dark:text-violet-300",
  },
  {
    key: "brands",
    label: "Brands",
    icon: "Tag",
    color:
      "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900",
    accent: "text-amber-600 dark:text-amber-300",
  },
];
