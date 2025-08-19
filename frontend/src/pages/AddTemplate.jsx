//pages/AddTemplate.jsx
import React, { useState } from "react";
import axiosInstance from "../utils/axiosinstance";
import { useNavigate } from "react-router-dom";

export default function AddTemplate() {
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("");
  const [imageData, setImageData] = useState(null);
  const [tplError, setTplError] = useState("");
  const [tplLoading, setTplLoading] = useState(false);

  const navigate = useNavigate();

  // Convert image -> base64
  const onPickImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageData(reader.result);
    reader.readAsDataURL(f);
  };

  // Submit template
  const handleAddTemplate = async (e) => {
    e.preventDefault();
    setTplError("");
    if (!newTemplateName || !newTemplateCategory || !imageData) {
      setTplError("Please fill all fields and upload an image.");
      return;
    }
    setTplLoading(true);
    try {
      const res = await axiosInstance.post("/api/admin/templates", {
        name: newTemplateName,
        category: newTemplateCategory,
        imageData,
      });

      // redirect to editor with the newly added template
      navigate("/editor", { state: { template: res.data } });

    } catch (err) {
      console.error(err);
      setTplError("Failed to add template.");
    } finally {
      setTplLoading(false);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Add Official Template</h2>
      {tplError && <div className="text-red-500 mb-3">{tplError}</div>}
      <form onSubmit={handleAddTemplate} className="space-y-4 max-w-lg mx-auto">
        <input
          type="text"
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
          placeholder="Template Name"
          required
        />
        <input
          type="text"
          value={newTemplateCategory}
          onChange={(e) => setNewTemplateCategory(e.target.value)}
          placeholder="Template Category"
          required
        />
        <input type="file" onChange={onPickImage} accept="image/*" required />
        <button type="submit" disabled={tplLoading}>
          {tplLoading ? "Adding..." : "Add Template"}
        </button>
      </form>
    </section>
  );
}
