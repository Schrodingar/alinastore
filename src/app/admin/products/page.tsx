import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
      <>
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Products</h1>
          <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
          </Button>
        </div>
        <ProductsTable products={products} />
      </>
  );
}

function ProductsTable({ products }: { products: any[] }) {
  if (products.length === 0) return <p>No products found</p>;

  return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <span className="sr-only">Available</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.isAvailableForPurchase ? <CheckCircle2 /> : <XCircle className="stroke-destructive" />}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
                <TableCell>{formatNumber(product._count.orders)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                      <DropdownMenuSeparator />
                      <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
  );
}
