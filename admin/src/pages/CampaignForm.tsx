import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCampaign, updateCampaign, createCampaign } from "../service/campaign.service";
import type { Campaign } from "../types/campaign.types";
import { get } from "../service/api";

type CampaignFormData = {
  id?:string;
  name: string;
  description: string;
  image: File | null;
  imageUrl: string;
  outroText: string;
  outroImage: File | null;
  outroImageUrl: string;
  status: "inactive" | "active";
  creatureIds: string[];
  stages: Stage[];
};

type Stage = {
  stageIndex: number;
  enemyCreatureId: string;
};

type Creature = {
  id: string;
  name: string;
};

const defaultForm: CampaignFormData = {
  name: "",
  description: "",
  image: null,
  imageUrl: "",
  outroText: "",
  outroImage: null,
  outroImageUrl: "",
  status: "inactive",
  creatureIds: [],
  stages: [],
};

export function CampaignForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<CampaignFormData>(defaultForm);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);

  useEffect(() => {
    async function init() {
      // Fetch creatures and campaign in parallel, independently
      const [creaturesResult, campaignResult] = await Promise.allSettled([
        get<Creature[] | { data: Creature[] }>("/creatures"),
        isEdit && id ? getCampaign(id) : Promise.resolve(null),
      ]);

      if (creaturesResult.status === "fulfilled") {
        const data = creaturesResult.value;
        setCreatures(Array.isArray(data) ? data : (data as any).data ?? []);
      } else {
        console.error("Failed to fetch creatures:", creaturesResult.reason);
      }

      if (campaignResult.status === "fulfilled" && campaignResult.value) {
        const c = campaignResult.value as Campaign;
        setForm({
          id:c.template.id,
          name: c.template.name ?? "",
          description: c.template.description ?? "",
          image: null,
          imageUrl: c.template.imageUrl ?? "",
          outroText: c.template.outroText ?? "",
          outroImage: null,
          outroImageUrl: c.template.outroImage ?? "",
          status: c.template.status ?? "inactive",
          creatureIds: c.playableCreatureIds ?? [],
          stages: c.stages ?? [],
        });
      } else if (campaignResult.status === "rejected") {
        console.error("Failed to fetch campaign:", campaignResult.reason);
      }

      setIsFetching(false);
    }

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  function set<K extends keyof CampaignFormData>(
    key: K,
    value: CampaignFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCreature(creatureId: string) {
    setForm((prev) => ({
      ...prev,
      creatureIds: prev.creatureIds.includes(creatureId)
        ? prev.creatureIds.filter((x) => x !== creatureId)
        : [...prev.creatureIds, creatureId],
    }));
  }

  function addStage() {
    setForm((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          stageIndex: prev.stages.length,
          enemyCreatureId: "",
        },
      ],
    }));
  }

  function updateStage(index: number, enemyCreatureId: string) {
    setForm((prev) => ({
      ...prev,
      stages: prev.stages.map((s, i) =>
        i === index ? { ...s, enemyCreatureId } : s
      ),
    }));
  }

  function removeStage(index: number) {
    setForm((prev) => ({
      ...prev,
      stages: prev.stages
        .filter((_, i) => i !== index)
        .map((s, i) => ({
          ...s,
          stageIndex: i,
        })),
    }));
  }

  async function handleSubmit() {
    if (!form.name.trim()) return;

    setIsLoading(true);

    try {
      if (isEdit && id) {
        // KEEP UPDATE FLOW AS JSON
        const payload = {
          id:form.id,
          name: form.name,
          description: form.description,
          imageUrl: form.imageUrl,
          outroText: form.outroText,
          outroImage: form.outroImageUrl,
          status: form.status,
          creatureIds: form.creatureIds,
          stages: form.stages,
        };

        await updateCampaign(payload);
      } else {
        // CREATE FLOW USES MULTIPART
        const fd = new FormData();

        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("outroText", form.outroText);

        if (form.image) {
          fd.append("image", form.image);
        }

        if (form.outroImage) {
          fd.append("outro_image", form.outroImage);
        }

        fd.append(
          "creatureIds",
          JSON.stringify(form.creatureIds)
        );

        fd.append(
          "stages",
          JSON.stringify(form.stages)
        );

        await createCampaign(fd);
      }

      navigate("/campaigns");
    } catch (err) {
      console.error("Failed to save campaign:", err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
        <span className="ml-2 text-gray-500">Loading…</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">
        {isEdit ? "Edit Campaign" : "New Campaign"}
      </h1>

      <Section title="Details">
        <Field label="Campaign Name *">
          <input
            className={input()}
            placeholder="Campaign Name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>

        <Field label="Description">
          <textarea
            className={input()}
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Intro Image">
            <input
              type="file"
              accept="image/*"
              className={input()}
              onChange={(e) =>
                set("image", e.target.files?.[0] ?? null)
              }
            />

            {form.imageUrl && !form.image && (
              <img
                src={form.imageUrl}
                alt="current intro"
                className="mt-2 h-20 rounded object-cover"
              />
            )}
          </Field>

          <Field label="Outro Image">
            <input
              type="file"
              accept="image/*"
              className={input()}
              onChange={(e) =>
                set("outroImage", e.target.files?.[0] ?? null)
              }
            />

            {form.outroImageUrl && !form.outroImage && (
              <img
                src={form.outroImageUrl}
                alt="current outro"
                className="mt-2 h-20 rounded object-cover"
              />
            )}
          </Field>
        </div>

        <Field label="Outro Text">
          <textarea
            className={input()}
            placeholder="Outro Text"
            rows={2}
            value={form.outroText}
            onChange={(e) => set("outroText", e.target.value)}
          />
        </Field>

        <Field label="Status">
          <select
            className={input()}
            value={form.status}
            onChange={(e) =>
              set(
                "status",
                e.target.value as "inactive" | "active"
              )
            }
          >
            <option value="inactive">Inactive</option>
            <option value="active">Active</option>
          </select>
        </Field>
      </Section>

      <Section title="Playable Creatures">
        <p className="text-sm text-gray-500">
          Select the creatures players can use in this campaign.
        </p>

        <div className="space-y-1 max-h-60 overflow-y-auto">
          {creatures.length === 0 && (
            <p className="text-sm text-gray-400">
              No creatures available.
            </p>
          )}

          {creatures.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-purple-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={form.creatureIds.includes(c.id)}
                onChange={() => toggleCreature(c.id)}
                className="accent-purple-600"
              />

              <span className="text-gray-800 text-sm">
                {c.name}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Stages">
        <p className="text-sm text-gray-500">
          Define the stages players will fight through.
        </p>

        <div className="space-y-2">
          {form.stages.map((stage, i) => (
            <div
              key={i}
              className="flex gap-3 items-center"
            >
              <span className="text-sm font-medium text-gray-600 w-16 shrink-0">
                Stage {stage.stageIndex}
              </span>

              <select
                className={`${input()} flex-1`}
                value={stage.enemyCreatureId}
                onChange={(e) =>
                  updateStage(i, e.target.value)
                }
              >
                <option value="">Select Enemy</option>

                {creatures.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => removeStage(i)}
                className="text-red-500 hover:text-red-700 text-sm px-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addStage}
          className="text-sm text-purple-600 hover:text-purple-800 font-medium"
        >
          + Add Stage
        </button>
      </Section>

      <div className="flex gap-2 justify-end pb-8">
        <button
          type="button"
          onClick={() => navigate("/campaigns")}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !form.name.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading && <Spinner />}

          {isLoading
            ? "Saving…"
            : isEdit
              ? "Update Campaign"
              : "Create Campaign"}
        </button>
      </div>
    </div>
  );
}

function input() {
  return "border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm";
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-purple-100 shadow-sm p-6 space-y-4">
      <h2 className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
        {title}
      </h2>

      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />

      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}