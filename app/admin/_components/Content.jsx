import React from 'react'

const Content = () => {
    const pages = ['FAQ', 'Terms and Conditions', 'Privacy Policy', 'About Us'];

    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Content Management</h2>
        <div className="space-y-4">
          {pages.map((page) => (
            <div
              key={page}
              className="flex items-center justify-between border-b pb-2"
            >
              <span>{page}</span>
              <button className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
                Edit
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-medium">Announcements</h3>
          <textarea
            className="w-full rounded border p-2"
            rows={4}
            placeholder="Write your announcement here..."
          ></textarea>
          <button className="mt-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
            Publish
          </button>
        </div>
      </div>
    );
}

export default Content