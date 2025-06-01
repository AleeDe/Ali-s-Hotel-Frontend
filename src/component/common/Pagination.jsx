import React from 'react';

export default function Pagination({ roomsPerPage, totalRooms, currentPage, paginate }) {
    const pageNumber = [];

    for (let i = 1; i <= Math.ceil(totalRooms / roomsPerPage); i++) {
        pageNumber.push(i);
    }

    return (
        <div className="flex justify-center p-2.5">
            <ul className="list-none flex p-0">
                {pageNumber.map((number) => (
                    <li key={number} className="mx-1.5">
                        <button
                            onClick={() => paginate(number)}
                            className={`bg-white text-teal-600 border border-teal-600 rounded px-3 py-2 cursor-pointer transition duration-300 ${
                                currentPage === number ? 'bg-teal-600 text-white' : ''
                            }`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
