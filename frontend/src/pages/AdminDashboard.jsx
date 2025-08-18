// pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosinstance";
import { useDispatch } from "react-redux";
import { setAllUsers } from "../store/userSlice";

export default function AdminDashboard() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Template form (image upload)
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("");
  const [imageData, setImageData] = useState(null);
  const [tplError, setTplError] = useState("");
  const [tplLoading, setTplLoading] = useState(false);

  const dispatch = useDispatch();

  // fetch designs (admin)
  useEffect(() => {
    const fetchAllDesigns = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/admin/designs");
        setDesigns(res.data);
      } catch (err) {
        console.error("Error fetching all designs:", err);
        setDesigns([]);
      }
      setLoading(false);
    };
    fetchAllDesigns();
  }, []);

  useEffect(()=>{
    async function fetchUsers(){
      try {
      const res = await axiosInstance.get("/api/admin/getUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
      if(res){
        dispatch(setAllUsers(res.data));
        console.log(res.data);
      }
    } catch (error) { 
      console.log('Error fetching allUsers',error);
    }
    }
    fetchUsers();
  },[])

  // fetch users -> redux
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const res = await axiosInstance.get("/api/admin/getUsers");
  //       if (res) dispatch(setAllUsers(res.data));
  //     } catch (error) {
  //       console.log("Error fetching allUsers", error);
  //     }
  //   };
  //   fetchUsers();
  // }, [dispatch]);

  // delete a design (admin)
  const handleDelete = async (designId) => {
    if (!window.confirm("Delete this design?")) return;
    try {
      await axiosInstance.delete(`/api/admin/designs/${designId}`);
      setDesigns((prev) => prev.filter((d) => d._id !== designId));
      alert("Design deleted.");
    } catch (err) {
      alert("Failed to delete design.");
      console.error(err);
    }
  };

  // image input -> base64
  const onPickImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageData(reader.result);
    reader.readAsDataURL(f);
  };

  // add template by image upload
  const handleAddTemplate = async (e) => {
    e.preventDefault();
    setTplError("");
    if (!newTemplateName || !newTemplateCategory || !imageData) {
      setTplError("Please fill all fields and upload an image.");
      return;
    }
    setTplLoading(true);
    try {
      await axiosInstance.post("/api/admin/templates", {
        name: newTemplateName,
        category: newTemplateCategory,
        imageData,
      });
      alert("Template added!");
      setNewTemplateName("");
      setNewTemplateCategory("");
      setImageData(null);
    } catch (err) {
      console.error(err);
      setTplError("Failed to add template.");
    } finally {
      setTplLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-60px)] bg-gray-900 text-white pt-4">
      <div className="p-8 w-full max-w-4xl rounded bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

        {/* Designs */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">All Users' Designs</h2>
          {loading ? (
            <p>Loading designs...</p>
          ) : designs.length === 0 ? (
            <p>No designs found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {designs.map((design) => (
                <div
                  key={design._id}
                  className="bg-gray-700 p-4 rounded shadow flex flex-col"
                >
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg mb-2">{design.name}</h3>
                    <p className="text-sm mb-1">
                      By: {design.username || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Shapes:{" "}
                      {Array.isArray(design.Shapes) ? design.Shapes.length : 0}
                    </p>
                    {design.thumbnailUrl ? (
                      <img
                        className="mt-2 rounded"
                        src={design.thumbnailUrl}
                        alt={design.name}
                      />
                    ) : null}
                  </div>
                  <button
                    onClick={() => handleDelete(design._id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded mt-4"
                  >
                    Delete Design
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Template Uploader */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Add Official Template (Image)
          </h2>
          {tplError && <div className="text-red-500 mb-3">{tplError}</div>}
          <form
            onSubmit={handleAddTemplate}
            className="space-y-4 max-w-lg mx-auto"
          >
            <div>
              <label
                className="block mb-1 font-semibold"
                htmlFor="templateName"
              >
                Template Name
              </label>
              <input
                id="templateName"
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Official template name"
                required
              />
            </div>
            <div>
              <label
                className="block mb-1 font-semibold"
                htmlFor="templateCategory"
              >
                Template Category
              </label>
              <input
                id="templateCategory"
                type="text"
                value={newTemplateCategory}
                onChange={(e) => setNewTemplateCategory(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="e.g. Poster, Banner, Card..."
                required
              />
            </div>
            <div>
              <label
                className="block mb-1 font-semibold"
                htmlFor="templateImage"
              >
                Template Image
              </label>
              <input
                id="templateImage"
                type="file"
                onChange={onPickImage}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                accept="image/*"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded w-full"
              disabled={tplLoading}
            >
              {tplLoading ? "Adding Template..." : "Add Official Template"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
