// src/app/(main)/jobs-info/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

interface JobInfoFormData {
  job_info_id: number;
  title: string;
  location: string;
  type: string;
  pdf_url?: string;
  published: boolean;
}

export default function EditJobInfoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<JobInfoFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchJobInfo = async () => {
      try {
        const res = await fetch(`/api/jobs-info?id=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load JobInfo");
        setForm({
          job_info_id: data.job_info_id,
          title: data.title,
          location: data.location,
          type: data.type,
          pdf_url: data.pdf_url,
          published: !!data.published,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobInfo();
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
      const res = await fetch("/api/jobs-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update JobInfo");

      router.push(`/jobs-info/${data.job_info_id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading JobInfo...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!form) return <p>JobInfo not found.</p>;

  return (
    <>
      <Breadcrumb pageName="Job Info" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Edit Job Info" className="space-y-5.5 !p-6.5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputGroup
                label="Title"
                placeholder="JobInfo Title"
                type="text"
                name="title"
                active
                required
                handleChange={handleChange}
                value={form.title}
              />

              <InputGroup
                label="Location"
                placeholder="Location"
                type="text"
                name="location"
                active
                required
                handleChange={handleChange}
                value={form.location}
              />

              <InputGroup
                label="Type"
                placeholder="Type"
                type="text"
                name="type"
                active
                required
                handleChange={handleChange}
                value={form.type}
              />

              <InputGroup
                label="PDF URL"
                placeholder="PDF URL"
                type="text"
                name="pdf_url"
                active
                handleChange={handleChange}
                value={form.pdf_url || ""}
              />

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
