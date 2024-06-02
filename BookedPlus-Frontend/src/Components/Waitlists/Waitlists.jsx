import { useEffect, useState } from "react";
import moment from "moment";

const Waitlists = () => {
  const [waitlistData, setWaitlistData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:4000/api/user/");
    const data = await response.json();
    if (response.ok) {
      setWaitlistData(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:4000/api/user/" + e.target.value,
      {
        method: "DELETE",
      }
    );
    fetchUsers();
    const data = await response.json();
    console.log(data);
  };

  const handleEdit = async (e, _id) => {
    e.preventDefault();
    const form = e.target;
    const firstname = form.firstname.value;
    const lastname = form.lastname.value;
    const email = form.email.value;
    const restaurant = form.restaurant.value;
    const phone = form.phone.value;
    const toSend = { firstname, lastname, email, restaurant, phone };

    fetch(`http://localhost:4000/api/user/${_id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(toSend),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetchUsers();
      });
  };

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = waitlistData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(waitlistData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="card">
      <div className="card-header">Waitlists</div>
      <table className="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Restaurant Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Date Signed Up</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((u, index) => {
            return (
              <tr key={u._id}>
                <td>{u.firstname}</td>
                <td>{u.lastname}</td>
                <td>{u.restaurant}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{moment(u.createdAt).format("MMMM DD, YYYY")}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      document.getElementById(`my_modal_${index}`).showModal();
                    }}
                  >
                    Edit
                  </button>
                  <dialog id={`my_modal_${index}`} className="modal text-black">
                    <div className="modal-box">
                      <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                          ✕
                        </button>
                      </form>
                      <div className="form-container">
                        <h2 id="formTitle">Edit Waitlist</h2>
                        <form onSubmit={(e) => handleEdit(e, u._id)} className="">
                          <div className="">
                            <div className="">
                              <label htmlFor="" className="">
                                First Name
                              </label>
                              <input
                                id="firstname"
                                type="text"
                                defaultValue={u.firstname}
                                name="firstname"
                                placeholder="firstname"
                                className="block w-full mt-1 mb-7 rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white text-black"
                              />
                              <label htmlFor="" className="">
                                Last Name
                              </label>
                              <input
                                id="lastname"
                                type="text"
                                defaultValue={u.lastname}
                                name="lastname"
                                placeholder="lastname"
                                className="block w-full mt-1 mb-7 rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white text-black"
                              />
                              <label htmlFor="" className="">
                                Email
                              </label>
                              <input
                                id="email"
                                type="text"
                                defaultValue={u.email}
                                name="email"
                                placeholder="email"
                                className="block w-full mt-1 mb-7 rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white text-black"
                              />
                              <label htmlFor="" className="">
                                Restaurant Name
                              </label>
                              <input
                                id="restaurant"
                                type="text"
                                defaultValue={u.restaurant}
                                name="restaurant"
                                placeholder="restaurant"
                                className="block w-full mt-1 mb-7 rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white text-black"
                              />
                              <label htmlFor="" className="">
                                Phone No.
                              </label>
                              <input
                                id="phone"
                                type="text"
                                defaultValue={u.phone}
                                name="phone"
                                placeholder="phone"
                                className="block w-full mt-1 mb-7 rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white text-black"
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="relative py-2.5 px-5 rounded-lg mt-6 bg-green-500 text-white w-full drop-shadow-lg"
                            onClick={() => {
                              document.getElementById(`my_modal_${index}`).close();
                            }}
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                  <button className="btn-delete ml-3" value={u._id} onClick={handleDelete}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
    </div>
  );
};

export default Waitlists;
