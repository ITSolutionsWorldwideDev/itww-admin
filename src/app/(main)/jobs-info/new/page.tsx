// src/app/(main)/jobs-info/new/page.tsx
"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobInfoFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const job_info_id = searchParams.get("id"); // optional ?id=123 for editing

  const [form, setForm] = useState({
    title: "",
    content: "",
    imageUrl: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (job_info_id) {
  //     fetch(`/api/jobs-info?id=${job_info_id}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data) {
  //           setForm({
  //             title: data.title || "",
  //             content: data.content || "",
  //             imageUrl: data.imageurl || "",
  //             published: !!data.published,
  //           });
  //         }
  //       });
  //   }
  // }, [job_info_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = job_info_id ? "PUT" : "POST";
    const body = job_info_id ? { ...form, job_info_id: job_info_id } : form;

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

              <InputGroup
                label="PDF URL"
                placeholder="PDF URL"
                type="text"
                name="pdf_url"
                active
                handleChange={handleChange}
              />

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
