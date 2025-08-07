import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Share2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  tags: string[];
  stock: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: () => void;
  onShare: (product: Product) => void;
}

const ProductCard = ({ product, onEdit, onDelete, onShare }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">₹{product.price}</span>
            <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
              {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onShare(product)}>
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;