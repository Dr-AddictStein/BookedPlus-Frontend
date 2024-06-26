import { useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { Link } from "react-router-dom";
import "./blog.css";
import ClipLoader from "react-spinners/ClipLoader";

const BlogCard = ({ imgSrc, title, description, link }) => (
  <div className="blog-card overflow-hidden transition transform">
    <img
      src={imgSrc}
      alt={title}
      className="w-full h-48 object-cover rounded-none"
    />
    <div className="p-4">
      <h3 className="text-[19px] font-bold mb-2">{title}</h3>
      <p className="text-gray-300 text-[16px]">{description}</p>
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
    const response = await fetch("https://api.bookedplus.com/api/blog/");
    const data = await response.json();
    if (response.ok) {
      setBlogs(data);
      console.log("sss", data);
    }
  };

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    fetchBlogs();
  }, []);

  useEffect(() => {
    console.log("DATA:", blogs);
    if (blogs.length > 0) {
      setLoader(false);
      console.log("Loadd Off");
    }
  }, [blogs]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top with smooth behavior
  },[currentPage])

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {loader ? (
        <div className=" h-[90vh] flex justify-center items-center">
          <ClipLoader
            color="#2e7de9"
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <section className="mx-auto">
          <div className="text-white min-h-screen flex flex-col">
            <main className="container mx-auto text-center py-16 px-4">
              <h1 className="text-4xl font-bold mb-8 fade-in-up">
                Online Catering Insights
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-up">
                {currentBlogs.map((u) => (
                  <BlogCard
                    imgSrc={`https://api.bookedplus.com/${u.thumbnail}`}
                    title={u.thumbnailheadline}
                    description={ReactHtmlParser(u.thumbnaildesc)}
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
                        onClick={() => {
                          if (currentPage > 1) {
                            paginate(currentPage - 1);
                          }
                        }}
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
                        onClick={() => {
                          if (currentPage < totalPages) {
                            paginate(currentPage + 1);
                          }
                        }}
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
      )}
    </>
  );
};

export default Blogs;
