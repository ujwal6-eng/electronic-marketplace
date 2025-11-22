import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Smartphone, Laptop, Headphones, Zap, Shield, Truck, Tablet, Watch, Gamepad2 } from "lucide-react";
import { mockProducts, categories } from "@/data/mockProducts";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 text-white py-12 px-4">
        <div className="container mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome to Electro
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Your one-stop marketplace for electronics, repair services, and community support
          </p>
          <div className="pt-4">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
          <Link to="/marketplace">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {mockProducts.slice(0, 6).map(product => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const gradients = [
              "from-blue-500 to-cyan-500",
              "from-purple-500 to-pink-500",
              "from-orange-500 to-red-500",
              "from-emerald-500 to-teal-500",
              "from-rose-500 to-pink-500",
              "from-violet-500 to-purple-500",
            ];
            const IconComponent = {
              Smartphone,
              Laptop,
              Tablet,
              Headphones,
              Watch,
              Gamepad2,
            }[category.icon as 'Smartphone' | 'Laptop' | 'Tablet' | 'Headphones' | 'Watch' | 'Gamepad2'];
            
            return (
              <Link key={category.id} to={`/marketplace?category=${category.id}`}>
                <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-violet-500">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${gradients[index]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {IconComponent && <IconComponent className="w-8 h-8 text-white" />}
                    </div>
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-violet-500 transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Why Choose Electro?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Fast Delivery", desc: "Quick and reliable shipping", gradient: "from-amber-500 to-orange-500" },
            { icon: Shield, title: "Secure Payment", desc: "100% secure transactions", gradient: "from-emerald-500 to-teal-500" },
            { icon: Truck, title: "Free Shipping", desc: "On orders over $50", gradient: "from-blue-500 to-cyan-500" },
          ].map((feature, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-2`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-violet-500 to-purple-500 border-0 text-white">
          <CardContent className="py-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm opacity-90">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm opacity-90">Technicians</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm opacity-90">Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <BottomNav />
      <FloatingActionButton />
    </div>
  );
};

export default Index;
