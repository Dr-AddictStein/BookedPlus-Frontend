import "./blog.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ imgSrc, title, description, link }) => (
  <div className="blog-card overflow-hidden transition transform">
    <img
      src={imgSrc}
      alt={title}
      className="w-full h-48 object-cover rounded-none"
    />
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-300 text-xs">{description}</p>
      <Link to={link} className="block mt-4 text-blue-400 hover:text-blue-500">
        Read More
      </Link>
    </div>
  </div>
);

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const fetchBlogs = async () => {
    const response = await fetch("http://localhost:4000/api/blog/");
    const data = await response.json();
    if (response.ok) {
      setBlogs(data);
      console.log("sss", data);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <section className="mx-auto">
        <div className="text-white min-h-screen flex flex-col">
          <main className="container mx-auto text-center py-16 px-4">
            <h1 className="text-4xl font-bold mb-8 fade-in-up">
              Online Catering Insights
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-up">
              {currentBlogs.map((u) => (
                <BlogCard
                  imgSrc={u.thumbnail}
                  title={u.thumbnailheadline}
                  description={u.thumbnaildesc.split(">")[1].split("<")[0]}
                  link={`/blogdetails/:${u._id}`}
                  key={u._id}
                />
              ))}
            </div>

            <div className="mt-8 fade-in-up">
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
          </main>
        </div>
      </section>
    </>
  );
};

export default Blogs;
