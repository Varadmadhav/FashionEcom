import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '@/context/ProductStoreContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import {
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
  Shield
} from 'lucide-react';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug, getRelatedProducts } = useProductStore();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = slug ? getProductBySlug(slug) : undefined;
  const relatedProducts = product ? getRelatedProducts(product, 4) : [];

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      setSelectedSize('');
      setOpenAccordion('details');
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-brand-fg mb-4">Product Not Found</h2>
          <Link to="/" className="text-brand-muted hover:text-brand-fg uppercase tracking-widest text-sm transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [...product.images, ...product.galleryImages];
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: 'Natural',
      image: product.images[0]
    });
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Top Nav could go here, omitting for brevity */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Image Gallery */}
          <div className="flex flex-col space-y-4">
            <div className="aspect-[3/4] w-full overflow-hidden bg-brand-surface relative">
              <img
                key={selectedImage} // forces re-render for simple transition, though css transition is better
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-100"
              />
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-20 h-28 overflow-hidden border ${selectedImage === img ? 'border-brand-espresso' : 'border-transparent'} transition-colors duration-300`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Panel */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-brand-muted uppercase tracking-widest text-xs font-semibold">
                {product.collection}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl text-brand-fg mb-2">
              {product.name}
            </h1>
            
            <div className="text-brand-muted text-xs font-mono mb-6">
              SKU: {product.sku}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-2xl font-semibold text-brand-fg">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-brand-muted line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.badges.map((badge, idx) => (
                  <span key={idx} className="bg-brand-surface text-brand-espresso text-xs uppercase tracking-wider px-3 py-1 font-medium">
                    {badge}
                  </span>
                ))}
              </div>
            )}

            <p className="text-brand-fg text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-brand-fg text-sm font-medium uppercase tracking-wider">Size</span>
                <button className="text-brand-muted hover:text-brand-fg text-xs underline underline-offset-4 transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm font-medium border transition-colors duration-300 ${
                      selectedSize === size
                        ? 'border-brand-espresso bg-brand-espresso text-white'
                        : 'border-brand-border text-brand-fg hover:border-brand-espresso'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={!product.availability || product.stockQuantity === 0}
                className="w-full bg-brand-espresso text-white uppercase tracking-widest text-sm font-semibold py-4 flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {!product.availability || product.stockQuantity === 0
                    ? 'Out of Stock'
                    : 'Add to Bag'}
                </span>
              </button>
              
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-full border border-brand-border uppercase tracking-widest text-sm font-semibold py-4 flex items-center justify-center space-x-2 transition-colors ${
                  inWishlist ? 'bg-brand-surface text-brand-espresso' : 'text-brand-fg hover:border-brand-espresso'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-brand-espresso' : ''}`} />
                <span>{inWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Occasions */}
            {product.occasions && product.occasions.length > 0 && (
              <div className="mb-10 text-sm text-brand-muted">
                <span className="mr-2">Perfect for:</span>
                {product.occasions.join(', ')}
              </div>
            )}

            {/* Accordions */}
            <div className="border-t border-brand-border divide-y divide-brand-border">
              {/* Details */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between text-left text-brand-fg hover:text-brand-espresso transition-colors uppercase tracking-widest text-sm font-semibold"
                >
                  <span>Details & Specifications</span>
                  {openAccordion === 'details' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openAccordion === 'details' && (
                  <div className="pt-4 pb-2 text-sm text-brand-fg space-y-4">
                    <ul className="list-disc pl-5 space-y-2">
                      {product.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                    {product.finish && (
                      <p><span className="font-semibold">Finish:</span> {product.finish}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('delivery')}
                  className="w-full flex items-center justify-between text-left text-brand-fg hover:text-brand-espresso transition-colors uppercase tracking-widest text-sm font-semibold"
                >
                  <span>Delivery & Returns</span>
                  {openAccordion === 'delivery' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openAccordion === 'delivery' && (
                  <div className="pt-4 pb-2 text-sm text-brand-fg space-y-6">
                    <div className="flex items-start space-x-3">
                      <Truck className="w-5 h-5 mt-0.5 text-brand-muted" />
                      <div>
                        <h4 className="font-semibold mb-1">Estimated Delivery</h4>
                        <p className="text-brand-muted">{product.estimatedDelivery}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RotateCcw className="w-5 h-5 mt-0.5 text-brand-muted" />
                      <div>
                        <h4 className="font-semibold mb-1">Free Returns</h4>
                        <p className="text-brand-muted">Within 30 days of delivery.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 mt-0.5 text-brand-muted" />
                      <div>
                        <h4 className="font-semibold mb-1">Secure Checkout</h4>
                        <p className="text-brand-muted">Your payment information is processed securely.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-brand-border pt-16">
            <h2 className="font-serif text-3xl text-brand-fg mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
