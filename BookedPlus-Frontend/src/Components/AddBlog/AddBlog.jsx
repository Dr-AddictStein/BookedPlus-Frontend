import React, { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { FiPlusCircle } from "react-icons/fi";
import './custom.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

const img_hosting_token = import.meta.env.VITE_Image_Upload_token;
const AddBlog = () => {
    const navigate=useNavigate();

    const {user}=useAuthContext();

    if(!user){
      navigate('/')
    }
    const img_hosting_url = `https://api.imgbb.com/1/upload?expiration=600&key=${img_hosting_token}`;
    const editor1 = useRef(null);
    const [authors, setAuthors] = useState([]);
    const [sections, setSections] = useState([]);
    const [hideIndex, setHideIndex] = useState(-1); // -1 means no button is hidden initially

    // Array to hold refs for each editor in the sections
    const editorRefs = useRef([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/author/')
            .then(res => res.json())
            .then(data => {
                setAuthors(data);
                console.log(data);
            })
            .catch(error => console.log(error))
    }, []);

    const addSection = () => {
        setSections([...sections, { id: sections.length }]);
        setHideIndex(sections.length); // Hide the current button

        // Create a new ref and add it to the array
        editorRefs.current.push(React.createRef());
    };

    const uploadImage = (file) => {
        const formData = new FormData();
        formData.append('image', file);

        return fetch(img_hosting_url, {
            method: 'POST',
            body: formData
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Image upload failed');
                }
                return res.json();
            })
            .then(imgResponse => {
                return imgResponse.data.display_url;
            })
            .catch(error => {
                console.error('Image upload error:', error);
                return null;
            });
    };

    function getAuthor(author){
        for(let i=0;i<authors.length;i++){
            if(authors[i].firstname+' '+authors[i].lastname===author){
                return authors[i];
            }
        }
    }

    const uploadAudio = async (audioFile) => {
        const formData = new FormData();
        formData.append('audio', audioFile);
    
        try {
            const response = await axios.post('http://localhost:4000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.path; // Assuming the server returns the path of the uploaded file
        } catch (error) {
            console.error('Error uploading audio file:', error);
            throw error;
        }
    };

    const createBlog = async (e) => {
        e.preventDefault();
        const form = e.target;
        const thumbFile = form.thumb.files[0];
        const thumbhead = form.thumbhead.value;
        const thumbdesc = editor1.current.value;
        const headline = form.headline.value;
        const thumbaudio = form.audio.files[0];
        const author = form.author.value;

        const thumbImageUrl = await uploadImage(thumbFile);
        const thumbaudioUrl = thumbaudio ? await uploadAudio(thumbaudio) : null;

        // Collecting section data with image upload
        const body = await Promise.all(sections.map(async (section, index) => {
            const imageFile = form[`image-${section.id}`].files[0];
            const imageUrl = await uploadImage(imageFile);
            const sectionHeader = form[`sectionHeader-${section.id}`].value;
            const desc = editorRefs.current[index].current.value;

            return {
                image: imageUrl,
                header:sectionHeader,
                desc
            };
        }));

        const newBlog = {
            thumbnail: thumbImageUrl,
            thumbnailheadline:thumbhead,
            thumbnaildesc:thumbdesc,
            headline,
            audio: thumbaudioUrl,
            author:getAuthor(author),
            body
        };

        console.log(newBlog);
        console.log("AADUUUD",newBlog.audio.name)

        // Make your API call here to save the newBlog data
        try {
            const response = await axios.post(
              "http://localhost:4000/api/blog/",
              newBlog
            );
      
            console.log("Form submitted successfully!", response.data);
            e.target.reset();
            navigate('/665bc136ca6d454ec0f5eed5');
          } catch (error) {
            if (error.response.status === 409) {
              alert("Данные уже существуют");
            } else {
              console.log(error);
            }
          }
    };

    return (
        <div className="">
            <h2 id="formTitle" className='text-3xl font-semibold text-center pb-5'>Add Blog</h2>
            <form onSubmit={createBlog} id="authorForm">
                <div className="bg-gray-200 p-10 m-10 rounded-md text-black fixing">
                    <div className="form-group">
                        <label>Thumbnail</label>
                        <input type="file" name="thumb" className="file-input file-input-bordered w-full max-w-xs" />
                    </div>
                    <div className="form-group">
                        <label>Thumbnail Head</label>
                        <input type="text" name="thumbhead" required />
                    </div>
                    <div className="form-group">
                        <label>Thumbnail Description</label>
                        <JoditEditor name='thumbdesc' ref={editor1} required />
                    </div>
                    <div className="form-group">
                        <label>Headline</label>
                        <input type="text" name="headline" required />
                    </div>
                    <div className="form-group">
                        <label>Audio</label>
                        <input type="file" name="audio" accept="audio/*" />
                    </div>
                    <div className="form-group">
                        <label>Author</label>
                        <select name="author">
                            {
                                authors.map(singleAuthor => (
                                    <option key={singleAuthor._id}>
                                        {singleAuthor.firstname + ' ' + singleAuthor.lastname}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="flex justify-center">
                    {hideIndex === -1 && (
                        <button type="button" onClick={addSection} className="flex items-center gap-1 text-xl bg-[#4299e1] text-white px-3 py-2 rounded">
                            <FiPlusCircle /> Add Section
                        </button>
                    )}
                </div>
                <div id="destination-div">
                    {sections.map((section, index) => (
                        <div key={section.id}>
                            <div className="bg-gray-200 p-10 m-10 rounded-md text-black fixing">
                                <div className="form-group">
                                    <label>Image</label>
                                    <input type="file" name={`image-${section.id}`} className="file-input file-input-bordered w-full max-w-xs" />
                                </div>
                                <div className="form-group">
                                    <label>Header</label>
                                    <input type="text" name={`sectionHeader-${section.id}`}  />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <JoditEditor name={`desc-${section.id}`} ref={editorRefs.current[index]} required />
                                </div>
                            </div>
                            <div className="flex justify-center my-3">
                                {hideIndex === index && (
                                    <button type="button" onClick={addSection} className="flex items-center gap-1 text-xl bg-[#4299e1] text-white px-3 py-2 rounded">
                                        <FiPlusCircle /> Add Section
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="form-actions mx-10">
                    <button type="submit" className="btn-save">Submit Blog</button>
                </div>
            </form>
        </div>
    );
};

export default AddBlog;
