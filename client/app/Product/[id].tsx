// client/app/Product/[id].tsx
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Product } from "@/constants/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { dummyProducts } from "@/assets/assets";
import { COLORS } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart, itemCount } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Handle string | string[] from expo-router safely
  const productId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (!productId) return;

    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        // 🔹 CURRENT: Using dummy data
        const foundProduct =
          dummyProducts.find(
            (product: Product) => product._id === productId
          ) || null;

        // 🔹 FUTURE: Replace above block with API call
        // Example:
        // const response = await fetch(`${API_URL}/products/${productId}`);
        // const data = await response.json();
        // const foundProduct = data;

        if (isMounted) {
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    // Cleanup to prevent memory leaks when navigating fast
    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <Text className="text-primary text-lg">Product not found</Text>
      </SafeAreaView>
    );
  }

  const isLiked = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) {
      Toast.show({
        type: "info",
        text1: "No size selected",
        text2: "Please select a size",
      });
      return;
    }

    addToCart(product, selectedSize || "");

    Toast.show({
      type: "success",
      text1: "Added to Cart 🛒",
      text2: `${product.name} added successfully`,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Product Image Slider */}
        <View className="relative h-[450px] bg-gray-100 mb-6">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width
              );
              if (index !== activeImageIndex) {
                setActiveImageIndex(index);
              }
            }}
          >
            {product.images?.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{ width: width, height: 450 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Header Actions */}
          <View className="absolute top-2 left-4 right-4 flex-row justify-between items-center z-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/80 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleWishlist(product)}
              className="w-10 h-10 bg-white/80 rounded-full items-center justify-center"
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? COLORS.accent : COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Pagination Dots */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
            {product.images?.map((_, index) => (
              <View
                key={index}
                className={`h-3 rounded-full ${index === activeImageIndex
                    ? "bg-primary w-6"
                    : "bg-gray-300 w-3"
                  }`}
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View className="px-5">
          {/* Title + Rating */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-bold text-primary flex-1 mr-4">
              {product.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text className="text-sm font-bold ml-1">4.6</Text>
              <Text className="text-xs text-secondary ml-1">(85)</Text>
            </View>
          </View>

          {/* Price */}
          <Text className="text-2xl font-bold text-primary mb-6">
            ${product.price.toFixed(2)}
          </Text>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <>
              <Text className="text-base font-bold text-primary mb-3">
                Size
              </Text>
              <View className="flex-row gap-3 mb-6 flex-wrap">
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full items-center justify-center border ${selectedSize === size
                        ? "bg-primary border-primary"
                        : "bg-white border-gray-200"
                      }`}
                  >
                    <Text
                      className={`text-sm font-medium ${selectedSize === size
                          ? "text-white"
                          : "text-primary"
                        }`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Description */}
          <Text className="text-base font-bold text-primary mb-2">
            Description
          </Text>
          <Text className="text-secondary leading-6 mb-6">
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex-row items-center">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="flex-1 bg-primary py-4 rounded-full items-center shadow-lg flex-row justify-center"
        >
          <Ionicons name="bag-outline" size={20} color="white" />
          <Text className="text-white font-bold text-base ml-2">
            Add to Cart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/Cart")}
          className="ml-4"
        >
          <Ionicons name="cart-outline" size={26} color={COLORS.primary} />
          {itemCount > 0 && (
            <View className="absolute -top-1 -right-2 w-5 h-5 bg-black rounded-full justify-center items-center">
              <Text className="text-white text-[10px]">{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}