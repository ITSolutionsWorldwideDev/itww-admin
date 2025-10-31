// src/app/(main)/blogs/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MediaPickerModal from "@/components/Media/MediaPickerModal";

interface BlogFormData {
  blog_id: number;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
}

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<BlogFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaType, setMediaType] = useState<"featured" | "content" | null>(
    null
  );

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

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs?id=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load blog");
        setForm({
          blog_id: data.blog_id,
          title: data.title,
          content: data.content,
          imageUrl: data.imageurl,
          published: !!data.published,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    if (!form) return;
    setForm({ ...form, published: !form.published });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update blog");

      router.push(`/blogs/${data.blog_id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading blog...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!form) return <p>Blog not found.</p>;

  return (
    <>
      <Breadcrumb pageName="Blogs" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Edit Blog" className="space-y-5.5 !p-6.5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputGroup
                label="Title"
                placeholder="Blog Title"
                type="text"
                name="title"
                active
                required
                handleChange={handleChange}
                value={form.title}
              />

              <TextAreaGroup
                label="Blog Content"
                placeholder="Blog Content"
                active
                required
                name="content"
                defaultValue={form.content}
                handleChange={handleChange}
              />

              <InputGroup
                label="Image URL"
                placeholder="Image URL"
                type="text"
                name="imageUrl"
                active
                handleChange={handleChange}
                value={form.imageUrl || ""}
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

      {/* Attach Modal */}
      {showMediaModal && (
        <MediaPickerModal
          open={showMediaModal}
          multiple={mediaType === "content"}
          onClose={() => setShowMediaModal(false)}
          onSelect={handleSelectMedia}
        />
      )}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={handleToggle}
                />
                <span>Published</span>
              </label>

              {error && <p className="text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </ShowcaseSection>
        </div>
      </div>
    </>
  );
}

{
  /* <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Blog Title"
              className="w-full border p-2 rounded"
            />
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Blog Content"
              rows={10}
              className="w-full rounded border p-2"
            />
            <input
              name="imageUrl"
              value={form.imageUrl || ""}
              onChange={handleChange}
              placeholder="Image URL (optional)"
              className="w-full rounded border p-2"
            />

             */
}
