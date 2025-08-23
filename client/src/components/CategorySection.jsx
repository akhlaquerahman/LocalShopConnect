import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// categories array with more items
const categories = [
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=300&h=200&q=80",
    description: "Latest gadgets and devices",
    slug: "electronics"
  },
  {
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=300&h=200&q=80",
    description: "Trendy clothes and accessories",
    slug: "fashion"
  },
  {
    name: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=300&h=200&q=80",
    description: "Everything for your home",
    slug: "home-kitchen"
  },
  {
    name: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&h=200&q=80",
    description: "Best sellers and new releases",
    slug: "books"
  },
  {
    name: "Sports",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvZXxlbnwwfHwwfHx8MA%3D%3D",
    description: "Gear for every game",
    slug: "sports"
  },
  {
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJlYXV0eXxlbnwwfHwwfHx8MA%3D%3D",
    description: "Makeup, skincare & more",
    slug: "beauty"
  },
  {
    name: "Toys",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dG95fGVufDB8fDB8fHww",
    description: "Fun for all ages",
    slug: "toys"
  },
  {
    name: "Medicine",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
    description: "we need medicines to prevent or cure illnesses.",
    slug: "medicine"
  }
];

// Custom CSS for the horizontal scrolling effect
const scrollingStyle = `
  .scrolling-container {
    overflow-x: hidden;
    white-space: nowrap;
  }

  .scrolling-wrapper {
    display: inline-block;
    animation: scroll-left 40s linear infinite;
    white-space: nowrap;
    
    /* Make the animation stop on hover */
    &:hover {
      animation-play-state: paused;
    }
  }

  .scrolling-card {
    display: inline-block;
    margin: 1rem;
    width: 250px; /* Fixed width for each card */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
  }

  @keyframes scroll-left {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%); /* Half the width to create the loop */
    }
  }
`;

function CategorySection() {
  const cardsToDuplicate = categories.map((category, index) => (
    <div className="scrolling-card" key={index}>
      <div className="card h-100">
        <img 
          src={category.image} 
          className="card-img-top rounded-top" 
          alt={category.name}
          style={{ height: "150px", objectFit: "cover" }}
        />
        <div className="card-body text-center">
          <h5 className="card-title text-primary">{category.name}</h5>
          <p className="card-text text-muted mb-3">{category.description}</p>
          <Link to={`/category/${category.slug}`} className="btn btn-primary rounded-pill px-4">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <style>{scrollingStyle}</style>
      <div className="container my-5">
        <h2 className="text-center mb-4">Shop by Category</h2>
        <div className="scrolling-container">
          <div className="scrolling-wrapper">
            {cardsToDuplicate}
            {/* Duplicate the cards to create a seamless looping effect */}
            {cardsToDuplicate}
          </div>
        </div>
      </div>
    </>
  );
}

export default CategorySection;
