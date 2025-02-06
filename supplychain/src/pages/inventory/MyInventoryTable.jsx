import React from 'react'


const MyInventoryTable = ({ inventory }) => {


    return (
        <div>
            {inventory && inventory.products?.length > 0 ? (
                <div className="overflow-x-auto my-8">
                    <div className="border border-gray-300 shadow-lg rounded-lg overflow-hidden overflow-x-auto overflow-y-auto">
                        <table className="w-full table-auto border-collapse">
                            {/* Table Header */}
                            <thead className="bg-blue-600 text-white text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="  px-6 py-4 text-left">Product Name</th>
                                    <th className="  px-6 py-4 text-center">Quantity</th>
                                    <th className="  px-6 py-4 text-center">Price</th>

                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {inventory.products.map((product, index) => (
                                    <tr
                                        key={product._id}
                                        className={`border border-gray-300 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } hover:bg-blue-50 transition-all duration-200`}
                                    >
                                        <td className=" px-6 py-4 text-left">
                                            {product.productId?.title || "N/A"}
                                        </td>
                                        <td className=" px-6 py-4 text-center">
                                            {product.quantity || 0}
                                        </td>
                                        <td className=" px-6 py-4 text-center">
                                            {product.productId?.price ? `₹ ${product.productId.price.toFixed(2)}` : "N/A"}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                            {/* Table Footer */}
                            <tfoot>
                                <tr className="bg-gray-200 font-semibold text-gray-700">
                                    <td className=" px-6 py-4 text-left">Total Stock</td>
                                    <td className=" px-6 py-4 text-center">{inventory.remainingStock || 0}</td>
                                    <td className=" px-6 py-4 text-center">Total Dispatched: {inventory.dispatchedStock || 0}</td>

                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-600 font-semibold mt-5">No inventory available.</p>
            )}
        </div>
    )
}

export default MyInventoryTable
