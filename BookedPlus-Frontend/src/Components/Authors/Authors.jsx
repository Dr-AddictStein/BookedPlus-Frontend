import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

const img_hosting_token = import.meta.env.VITE_Image_Upload_token;
const Authors = () => {
  const img_hosting_url = `https://api.imgbb.com/1/upload?expiration=600&key=${img_hosting_token}`;
  const [authorData, setauthorData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  const fetchAuthors = async () => {
    const response = await fetch("http://localhost:4000/api/author/");
    const data = await response.json();
    if (response.ok) {
      setauthorData(data);
      console.log("sss", data);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return fetch(img_hosting_url, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Image upload failed");
        }
        return res.json();
      })
      .then((imgResponse) => {
        return imgResponse.data.display_url;
      })
      .catch((error) => {
        console.error("Image upload error:", error);
        return null;
      });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:4000/api/author/" + e.target.value,
      {
        method: "DELETE",
      }
    );
    fetchAuthors();
    const data = await response.json();
    console.log(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const form = e.target;
    const thumbFile = form.thumb.files[0];
    const firstname = form.firstname.value;
    const lastname = form.lastname.value;
    const image = await uploadImage(thumbFile);
    const toSend = { firstname, lastname, image };

    console.error("XOXOXOXO:", toSend);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/author/",
        toSend
      );
      console.log("Form submitted successfully!", response.data);
      fetchAuthors();
      e.target.reset();
    } catch (error) {
      if (error.response.status === 409) {
        alert("Данные уже существуют");
      } else {
        console.log(error);
      }
    }
  };

  const handleEdit = async (e, _id) => {
    e.preventDefault();
    const form = e.target;
    const thumbFile = form.thumb.files[0];
    const firstname = form.firstname.value;
    const lastname = form.lastname.value;
    const image = await uploadImage(thumbFile);
    const toSend = { firstname, lastname, image };

    console.error("XOXOXOXO:", toSend);

    try {
      const response = await axios.patch(
        "http://localhost:4000/api/author/" + _id,
        toSend
      );
      console.log("Form submitted successfully!", response.data);
      fetchAuthors();
      e.target.reset();
    } catch (error) {
      if (error.response.status === 409) {
        alert("Данные уже существуют");
      } else {
        console.log(error);
      }
    }
  };

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = authorData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(authorData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="card text-black">
      <div className="card-header">Authors</div>
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((u, index) => (
            <tr key={u._id}>
              <td>
                <img src={u.image} alt="Author" />
              </td>
              <td>{u.firstname}</td>
              <td>{u.lastname}</td>
              <td>
                {moment(u.createdAt).format("MMMM DD, YYYY h:mm:ss A z")}
              </td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() =>
                    document.getElementById(`my_modal_${index}`).showModal()
                  }
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
                      <h2 id="formTitle">Edit Author</h2>
                      <form
                        onSubmit={(e) => handleEdit(e, u._id)}
                        className=""
                      >
                        <div className="">
                          <div className="">
                            <label htmlFor="" className="">
                              First Name
                            </label>
                            <input
                              id="firstname"
                              type="text"
                              name="firstname"
                              defaultValue={u.firstname}
                              placeholder="firstname"
                              className="block w-full mt-1 mb-7 rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white text-black "
                            />
                            <label htmlFor="" className="">
                              Last Name
                            </label>
                            <input
                              id="lastname"
                              type="text"
                              name="lastname"
                              defaultValue={u.lastname}
                              placeholder="lastname"
                              className="block w-full mt-1 mb-7 rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white text-black  "
                            />
                            <label>image</label>
                            <input
                              type="file"
                              name="thumb"
                              className="file-input file-input-bordered w-full "
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="relative py-2.5 px-5 rounded-lg mt-6 bg-green-500 text-white w-full drop-shadow-lg "
                          onClick={() => {
                            document
                              .getElementById(`my_modal_${index}`)
                              .close();
                          }}
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
                <button
                  className="btn-delete ml-3"
                  value={u._id}
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
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

      <button
        className="text-black mt-3 text-left"
        onClick={() => document.getElementById("my_modal_9").showModal()}
      >
        Add Author
      </button>
      <dialog id="my_modal_9" className="modal text-black">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="form-container">
            <h2 id="formTitle">Add Author</h2>
            <form onSubmit={(e) => handleAdd(e)} className="">
              <div className="">
                <div className="">
                  <label htmlFor="" className="">
                    First Name
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    name="firstname"
                    placeholder="firstname"
                    className="block w-full mt-1 mb-7 rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white text-black "
                  />
                  <label htmlFor="" className="">
                    Last Name
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    name="lastname"
                    placeholder="lastname"
                    className="block w-full mt-1 mb-7 rounded-lg p-3 pl-10 outline-none drop-shadow-lg bg-white text-black  "
                  />
                  <label>image</label>
                  <input
                    type="file"
                    name="thumb"
                    className="file-input file-input-bordered w-full "
                  />
                  <img
                    id="authorImagePreview"
                    src="#"
                    alt="Author Image"
                    className="hidden"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="relative py-2.5 px-5 rounded-lg mt-6 bg-green-500 text-white w-full drop-shadow-lg "
                onClick={() => {
                  document.getElementById(`my_modal_9`).close();
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Authors;

