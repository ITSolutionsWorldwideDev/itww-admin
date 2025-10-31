// src/app/(main)/jobs-info/new/page.tsx
"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import MediaPickerModal from "@/components/Media/MediaPickerModal";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobInfoFormPage() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const job_info_id = searchParams.get("id"); // optional ?id=123 for editing
  const [showMediaModal, setShowMediaModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    pdf_url: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // const method = job_info_id ? "PUT" : "POST";
    // const body = job_info_id ? { ...form, job_info_id: job_info_id } : form;

    const method = "POST";
    const body = form;

    const res = await fetch("/api/jobs-info", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/jobs-info");
    } else {
      alert("Failed to save JobInfo");
    }
    setLoading(false);
  };

  return (
    <>
      <Breadcrumb pageName="Job Info" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Add Job Info" className="space-y-5.5 !p-6.5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputGroup
                label="Title"
                placeholder="JobInfo Title"
                type="text"
                name="title"
                active
                required
                handleChange={handleChange}
              />

              <InputGroup
                label="Location"
                placeholder="Location"
                type="text"
                name="location"
                active
                required
                handleChange={handleChange}
              />

              <InputGroup
                label="Type"
                placeholder="Type"
                type="text"
                name="type"
                active
                required
                handleChange={handleChange}
              />

              {/* <InputGroup
                label="PDF URL"
                placeholder="PDF URL"
                type="text"
                name="pdf_url"
                active
                handleChange={handleChange}
              /> */}

              {/* Featured Image Picker */}
              <div>
                <label className="mb-2 block font-medium">Featured Image</label>

                {form.pdf_url ? (
                  <div className="relative w-40">
                    <img
                      src={form.pdf_url}
                      alt="Featured"
                      className="rounded border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, pdf_url: "" })}
                      className="absolute right-1 top-1 rounded bg-red-600 px-2 py-1 text-xs text-white"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMediaModal(true)}
                    className="rounded border border-dashed border-gray-400 px-4 py-2 hover:border-primary"
                  >
                    + Select Featured Image
                  </button>
                )}
              </div>

              {/* Media Picker Modal */}
              {showMediaModal && (
                <MediaPickerModal
                  open={showMediaModal}
                  multiple={false}
                  onClose={() => setShowMediaModal(false)}
                  onSelect={(files) => {
                    if (files[0]) {
                      setForm({ ...form, pdf_url: files[0].file_path });
                    }
                  }}
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
                {loading ? "Saving..." : "Save JobInfo"}
              </button>
            </form>
          </ShowcaseSection>
        </div>
      </div>
    </>
  );
}
