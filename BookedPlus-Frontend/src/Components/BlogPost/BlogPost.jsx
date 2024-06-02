import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";

const BlogPost = () => {
  const [blogData, setBlogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  const fetchBlogs = async () => {
    const response = await fetch("http://localhost:4000/api/blog/");
    const data = await response.json();
    if (response.ok) {
      setBlogData(data);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:4000/api/blog/" + e.target.value,
      {
        method: "DELETE",
      }
    );

    fetchBlogs();

    const data = await response.json();

    console.log(data);
  };

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = blogData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(blogData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="card">
      <div className="card-header">Blog Posts</div>
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((u, index) => {
            return (
              <tr key={u._id}>
                <td>
                  <img src={u.thumbnail} alt="Blog" />
                </td>
                <td>{u.headline}</td>
                <td>{u.author.firstname + ' ' + u.author.lastname}</td>
                <td>{moment(u.createdAt).format("MMMM DD, YYYY")}</td>
                <td>
                  <button className="btn-delete" value={u._id} onClick={handleDelete}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="mt-8 text-center">
        <nav aria-label="Page navigation">
          <ul className="inline-flex -space-x-px">
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-2 leading-tight ${
                    currentPage === index + 1
                      ? "text-white bg-blue-600"
                      : "text-gray-500 bg-white"
                  } border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <Link to={"/addblog"}>
        <button className="text-black mt-3 text-left">Add Blog</button>
      </Link>
    </div>
  );
};

export default BlogPost;
