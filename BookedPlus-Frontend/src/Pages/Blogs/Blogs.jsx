import blog1 from '../../assets/images/3.jpeg'
import blog2 from '../../assets/images/5.jpeg'
import blog3 from '../../assets/images/6.jpeg'
import blog4 from '../../assets/images/7.jpeg'
import blog5 from '../../assets/images/8.jpeg'
import blog6 from '../../assets/images/6.jpeg'
import './blog.css'

const BlogCard = ({ imgSrc, title, description, link }) => (
    <div className="blog-card overflow-hidden transition transform">
        <img src={imgSrc} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-gray-300 text-xs">{description}</p>
            <a href={link} className="block mt-4 text-blue-400 hover:text-blue-500">
                Read More
            </a>
        </div>
    </div>
);

const Blogs = () => {
    return (
        <>
            <section className='mx-auto'>
                <div className="text-white min-h-screen flex flex-col">
                    <main className="container mx-auto text-center py-16 px-4">
                        <h1 className="text-4xl font-bold mb-8 fade-in-up">Online Catering Insights</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-up">
                            <BlogCard
                                imgSrc={blog1}
                                title="Understanding Your Catering Audience"
                                description="Learn the importance of knowing your audience and how it can boost your catering business."
                                link="blogdetail1.html"
                            />
                            <BlogCard
                                imgSrc={blog2}
                                title="Maximizing Online Reservations"
                                description="Discover tips and strategies to increase your online catering reservations."
                                link="blogdetail.html"
                            />
                            <BlogCard
                                imgSrc={blog3}
                                title="The Power of Custom Menus"
                                description="Explore how custom menus can attract more customers and enhance their experience."
                                link="blogdetail3.html"
                            />
                            <BlogCard
                                imgSrc={blog4}
                                title="Effective Marketing Strategies"
                                description="Find out which marketing strategies work best for catering businesses."
                                link="blogdetail4.html"
                            />
                            <BlogCard
                                imgSrc={blog5}
                                title="Leveraging Social Media for Catering"
                                description="Learn how to effectively use social media to promote your catering services."
                                link="blogdetail5.html"
                            />
                            <BlogCard
                                imgSrc={blog6}
                                title="Streamlining Catering Operations"
                                description="Discover ways to make your catering operations more efficient and cost-effective."
                                link="blogdetail6.html"
                            />
                        </div>

                        <div className="mt-8 fade-in-up">
                            <nav aria-label="Page navigation">
                                <ul className="inline-flex -space-x-px">
                                    <li>
                                        <a
                                            href="#"
                                            className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
                                        >
                                            Previous
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                                        >
                                            1
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                                        >
                                            2
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                                        >
                                            3
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
                                        >
                                            Next
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </main>
                </div>
            </section>
            <footer className="text-center p-4 mt-auto">
                <a
                    href="index.html"
                    className="text-white font-thin text-base hover:text-blue-600 transition duration-200"
                >
                    Powered By Bookedplus
                </a>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent to-white mt-2"></div>
            </footer>
        </>
    );
};

export default Blogs;
