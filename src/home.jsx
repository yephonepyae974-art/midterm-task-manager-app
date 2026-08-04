import { useMemo, useState } from "react";
import { products, categories } from "./assets/data";
import {
    Cable,
    Headphones,
    Laptop,
    Mouse,
    Settings,
    TabletSmartphone,
} from "lucide-react";

function CategoryIcon(category) {
    switch (category?.icon) {
        case "mouse":
            return <Mouse className="h-5 w-5 text-blue-600" />;
        case "laptop":
            return <Laptop className="h-5 w-5 text-blue-600" />;
        case "tablet-smartphone":
            return <TabletSmartphone className="h-5 w-5 text-blue-600" />;
        case "headphones":
            return <Headphones className="h-5 w-5 text-blue-600" />;
        case "cable":
            return <Cable className="h-5 w-5 text-blue-600" />;
        default:
            return <Settings className="h-5 w-5 text-blue-600" />;
    }
}

export default function Home() {
    const [productList, setProductList] = useState(products);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [amount, setAmount] = useState(0);
    const [purchaseList, setPurchaseList] = useState([]);
    const [error, setError] = useState("");

    const filteredProducts =
        selectedCategory === "all"
            ? productList
            : productList.filter(
                (p) => String(p.category) === String(selectedCategory)
            );

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedProduct("");
        setAmount(0);
        setError("");
    };

    const handleAddItem = () => {
        setError("");

        const qty = Number(amount);

        if (!selectedProduct) {
            setError("Please select a product.");
            return;
        }

        if (qty <= 0) {
            setError("Purchase amount must be greater than zero.");
            return;
        }

        const product = productList.find(
            (p) => String(p.id) === String(selectedProduct)
        );

        if (!product) return;

        if (qty > product.inventory) {
            setError("Not enough inventory.");
            return;
        }

        // Update inventory
        setProductList((prev) =>
            prev.map((p) =>
                p.id === product.id
                    ? { ...p, inventory: p.inventory - qty }
                    : p
            )
        );

        // Update purchase list
        setPurchaseList((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, amount: item.amount + qty }
                        : item
                );
            }

            return [...prev, { ...product, amount: qty }];
        });

        setSelectedProduct("");
        setAmount(0);
    };

    const grandTotal = useMemo(() => {
        return purchaseList.reduce((sum, item) => {
            const discountedPrice =
                item.sellPrice * (1 - item.discount / 100);

            return sum + discountedPrice * item.amount;
        }, 0);
    }, [purchaseList]);

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">

                <h3 className="text-4xl font-bold mb-10">
                    Product Purchase System
                </h3>

                {/* Form */}
                <div className="grid grid-cols-12 gap-6 items-end">

                    {/* Category */}
                    <div className="col-span-4">
                        <label className="block font-semibold mb-2">
                            Select Category:
                        </label>

                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full border border-gray-400 rounded-lg p-3"
                        >
                            <option value="all">All</option>

                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Product */}
                    <div className="col-span-4">
                        <label className="block font-semibold mb-2">
                            Select Product:
                        </label>

                        <select
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            className="w-full border border-gray-400 rounded-lg p-3"
                        >
                            <option value="">Please Select An Item</option>

                            {filteredProducts.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title} (Stock: {p.inventory})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <div className="col-span-2">
                        <label className="block font-semibold mb-2">
                            Amount
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={amount}
                            disabled={!selectedProduct}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border border-gray-400 rounded-lg p-3 disabled:bg-gray-300"
                        />
                    </div>

                    {/* Button */}
                    <div className="col-span-2">
                        <button
                            onClick={handleAddItem}
                            disabled={!selectedProduct || Number(amount) <= 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg p-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Add Item
                        </button>
                    </div>

                </div>

                {error && (
                    <div className="mt-5 text-red-600 font-semibold">
                        {error}
                    </div>
                )}

                <hr className="my-8" />

                <table className="w-full border border-gray-400">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-3 w-16">#</th>
                            <th className="border p-3">ID</th>
                            <th className="border p-3">Item</th>
                            <th className="border p-3">Category</th>
                            <th className="border p-3">Price</th>
                            <th className="border p-3">Discount</th>
                            <th className="border p-3">Amount</th>
                            <th className="border p-3">Total</th>
                        </tr>
                    </thead>

                    <tbody>

                        {purchaseList.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="border p-8 text-center text-gray-500"
                                >
                                    No purchased items.
                                </td>
                            </tr>
                        ) : (
                            purchaseList.map((item, index) => {

                                const category = categories.find(
                                    (c) => c.id === item.category
                                );

                                const subtotal =
                                    item.sellPrice *
                                    (1 - item.discount / 100) *
                                    item.amount;

                                return (
                                    <tr key={item.id}>
                                        <td className="border p-3 text-center">
                                            {index + 1}
                                        </td>

                                        <td className="border p-3">
                                            {item.id}
                                        </td>

                                        <td className="border p-3">
                                            {item.title}
                                        </td>

                                        <td className="border p-3 text-center">
                                            {CategoryIcon(category)}
                                        </td>

                                        <td className="border p-3">
                                            ${item.sellPrice.toFixed(2)}
                                        </td>

                                        <td className="border p-3">
                                            {item.discount}%
                                        </td>

                                        <td className="border p-3">
                                            {item.amount}
                                        </td>

                                        <td className="border p-3">
                                            ${subtotal.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}

                    </tbody>
                </table>

                <div className="text-right mt-8 text-3xl font-bold">
                    Grand Total : ${grandTotal.toFixed(2)}
                </div>

            </div>
        </div>
    );
}