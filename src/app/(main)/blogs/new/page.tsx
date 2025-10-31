// src/app/(main)/blogs/new/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MediaPickerModal from "@/components/Media/MediaPickerModal";

export default function BlogFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaType, setMediaType] = useState<"featured" | "content" | null>(
    null,
  );

  const [form, setForm] = useState({
    title: "",
    content: "",
    imageUrl: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);

  // Load blog if editing
  useEffect(() => {
    if (blogId) {
      fetch(`/api/blogs?id=${blogId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setForm({
              title: data.title || "",
              content: data.content || "",
              imageUrl: data.imageurl || "",
              published: !!data.published,
            });
          }
        });
    }
  }, [blogId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = blogId ? "PUT" : "POST";
    const body = blogId ? { ...form, blog_id: blogId } : form;

    const res = await fetch("/api/blogs", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/blogs");
    } else {
      alert("Failed to save blog");
    }
    setLoading(false);
  };

  const openMediaPicker = (type: "featured" | "content") => {
    setMediaType(type);
    setShowMediaModal(true);
  };

  const handleSelectMedia = (files: any[]) => {
    if (mediaType === "featured" && files[0]) {
      setFeaturedImage(files[0].file_path);
    } else if (mediaType === "content") {
      setContentImages((prev) => [...prev, ...files.map((f) => f.file_path)]);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Blogs" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Add Blog" className="space-y-5.5 !p-6.5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputGroup
                label="Title"
                placeholder="Blog Title"
                type="text"
                name="title"
                active
                required
                handleChange={handleChange}
              />

              <TextAreaGroup
                label="Blog Content"
                placeholder="Blog Content"
                active
                required
                name="content"
                handleChange={handleChange}
              />

              <InputGroup
                label="Image URL"
                placeholder="Image URL"
                type="text"
                name="imageUrl"
                active
                handleChange={handleChange}
              />

              {/* Featured Image */}
              <div>
                <label className="mb-2 block font-medium">Featured Image</label>
                {featuredImage ? (
                  <div className="relative w-40">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="rounded border object-cover"
                    />
                    <button
                      onClick={() => setFeaturedImage(null)}
                      className="absolute right-1 top-1 rounded bg-red-600 px-2 py-1 text-xs text-white"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openMediaPicker("featured")}
                    className="rounded border border-dashed border-gray-400 px-4 py-2 hover:border-primary"
                  >
                    + Select Featured Image
                  </button>
                )}
              </div>
              {/* <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 min-h-[150px]"
          />
        </div> */}

              {/* Attach Modal */}
              {showMediaModal && (
                <MediaPickerModal
                  open={showMediaModal}
                  multiple={mediaType === "content"}
                  onClose={() => setShowMediaModal(false)}
                  onSelect={handleSelectMedia}
                />
              )}

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="published"
                  checked={form.published}
                  onChange={handleChange}
                />
                <span>Published</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-primary px-4 py-2 text-white hover:bg-opacity-90"
              >
                {loading ? "Saving..." : "Save Blog"}
              </button>
            </form>
          </ShowcaseSection>
        </div>
      </div>
    </>
  );
}
