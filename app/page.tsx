"use client";

import axios from "axios";
import Image from "next/image";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import LoadingComponent from "./Loading";

type Product = {
  id: number;
  title: string;
  image: string;
};

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[][]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Ref to store the table element
  const tableRef = useRef<HTMLTableElement>(null);

  // Fetch product data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://fakestoreapi.com/products");
        setLoading(false);
        const fetchedProducts: Product[] = response.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          image: item.image,
        }));
        // Group the products into rows of 5 columns
        const groupedProducts: Product[][] = [];
        for (let i = 0; i < fetchedProducts.length; i += 5) {
          groupedProducts.push(fetchedProducts.slice(i, i + 5));
        }
        setProducts(groupedProducts);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // Update the selected cell coordinates
    setSelectedCell({ row: rowIndex, col: colIndex });
  };

  // Function to handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    if (!selectedCell || !tableRef.current) return;

    const { row, col } = selectedCell;

    let nextRow = row;
    let nextCol = col;

    switch (event.key) {
      case "ArrowUp":
        nextRow = Math.max(0, row - 1);
        break;
      case "ArrowDown":
        nextRow = Math.min(products.length - 1, row + 1);
        break;
      case "ArrowLeft":
        nextCol = Math.max(0, col - 1);
        break;
      case "ArrowRight":
        nextCol = Math.min(products[row].length - 1, col + 1);
        break;
      default:
        return;
    }

    setSelectedCell({ row: nextRow, col: nextCol });

    // Focus on the next cell
    const nextCell = tableRef.current.rows[nextRow].cells[nextCol];
    nextCell.focus();
  };

  return (
    <>
      {loading ? (
        <LoadingComponent loading={loading} />
      ) : (
        <div>
          <table
            ref={tableRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
              borderCollapse: "collapse",
              borderSpacing: "0",
              width: "100%",
              height: "auto",
              outline: "none",
            }}
          >
            <tbody>
              {products.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((_, colIndex) => (
                    <td
                      key={colIndex}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      style={{
                        width: "20%",
                        height: "200px",
                        backgroundColor:
                          selectedCell?.row === rowIndex &&
                          selectedCell?.col === colIndex
                            ? "white"
                            : "black", // Cell color based on whether it's the selected cell or not
                        color: "black",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      {selectedCell?.row === rowIndex &&
                        selectedCell?.col === colIndex && (
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: "90%",
                              height: "90%",
                              padding: "10px",
                              boxSizing: "border-box",
                              overflow: "auto",
                            }}
                          >
                            <h2 className="line-clamp-1 capitalize">
                              {products[rowIndex][colIndex].title}
                            </h2>
                            <Image
                              src={products[rowIndex][colIndex].image}
                              alt={products[rowIndex][colIndex].title}
                              style={{
                                margin: "0 auto",
                                display: "block",
                              }}
                              height={100}
                              width={100}
                            />
                          </div>
                        )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
