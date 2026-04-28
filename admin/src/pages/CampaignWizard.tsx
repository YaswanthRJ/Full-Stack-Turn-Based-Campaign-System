import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/interceptor/axios";

type CampaignDetails = {
  name: string;
  description: string;
  imageUrl: string;
  outroText: string;
  outroImage: string;
  status: "inactive" | "active";
};

type Stage = {
  stageIndex: number;
  enemyCreatureId: string;
};

type Creature = {
  id: string;
  name: string;
};

const STORAGE_KEY = "campaign_wizard";

const defaultDetails: CampaignDetails = { name: "", description: "", imageUrl: "", outroText: "", outroImage: "", status: "inactive" };

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function CampaignWizard() {
  const navigate = useNavigate();

  const saved = loadSaved();

  const [step, setStep] = useState<number>(saved?.step ?? 0);
  const [campaignId, setCampaignId] = useState<string | undefined>(saved?.campaignId);
  const [details, setDetails] = useState<CampaignDetails>(saved?.details ?? defaultDetails);
  const [allCreatures, setAllCreatures] = useState<Creature[]>([]);
  const [selectedCreatures, setSelectedCreatures] = useState<string[]>(saved?.selectedCreatures ?? []);
  const [stages, setStages] = useState<Stage[]>(saved?.stages ?? []);

  // Persist wizard state on every relevant change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step, campaignId, details, selectedCreatures, stages })
    );
  }, [step, campaignId, details, selectedCreatures, stages]);

  // Re-fetch creatures when restoring a session past step 0
  useEffect(() => {
    if (step > 0) fetchCreatures();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function clearAndNavigate() {
    localStorage.removeItem(STORAGE_KEY);
    navigate("/campaigns");
  }

  async function fetchCreatures() {
    try {
      const res = await api.get("/creatures");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setAllCreatures(data);
    } catch (error) {
      console.error("Failed to fetch creatures:", error);
      setAllCreatures([]);
    }
  }

  async function handleDetailsNext() {
    try {
      const res = await api.post<{ id: string }>("/campaigns", details);
      setCampaignId(res.data.id);
      await fetchCreatures();
      setStep(1);
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  }

  async function handleCreaturesNext() {
    if (!campaignId) return;
    try {
      await api.post(`/campaigns/${campaignId}/creatures`, {
        creatureIds: selectedCreatures,
      });
      setStep(2);
    } catch (error) {
      console.error("Failed to add creatures:", error);
    }
  }

  async function handleStagesNext() {
    if (!campaignId) return;
    try {
      await api.post(`/campaigns/${campaignId}/stages`, { stages });
      clearAndNavigate();
    } catch (error) {
      console.error("Failed to add stages:", error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">New Campaign</h1>
      </div>

      <Stepper current={step} />

      {step === 0 && (
        <CampaignDetailsStep
          value={details}
          onChange={setDetails}
          onNext={handleDetailsNext}
          onCancel={clearAndNavigate}
        />
      )}

      {step === 1 && (
        <PlayableCreaturesStep
          creatures={allCreatures}
          selected={selectedCreatures}
          onChange={setSelectedCreatures}
          onBack={() => setStep(0)}
          onNext={handleCreaturesNext}
        />
      )}

      {step === 2 && (
        <CampaignStagesStep
          creatures={allCreatures}
          stages={stages}
          onChange={setStages}
          onBack={() => setStep(1)}
          onNext={handleStagesNext}
        />
      )}

    </div>
  );
}

function Stepper({ current }: { current: number }) {
  const steps = ["Details", "Creatures", "Stages"];

  return (
    <div className="flex gap-4">
      {steps.map((label, i) => (
        <div
          key={label}
          className={`px-3 py-1 rounded text-sm font-medium ${
            i === current
              ? "bg-purple-600 text-white"
              : i < current
              ? "bg-purple-200 text-purple-800"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

function CampaignDetailsStep({
  value,
  onChange,
  onNext,
  onCancel,
}: {
  value: CampaignDetails;
  onChange: (v: CampaignDetails) => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-purple-100 shadow-sm p-6 space-y-4">
      <input
        className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder="Campaign Name"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />

      <textarea
        className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder="Description"
        rows={3}
        value={value.description}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />

      <input
        className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder="Image URL"
        value={value.imageUrl}
        onChange={(e) => onChange({ ...value, imageUrl: e.target.value })}
      />

      <textarea
        className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder="Outro Text"
        rows={2}
        value={value.outroText}
        onChange={(e) => onChange({ ...value, outroText: e.target.value })}
      />

      <input
        className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder="Outro Image URL"
        value={value.outroImage}
        onChange={(e) => onChange({ ...value, outroImage: e.target.value })}
      />

      <select
        className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        value={value.status}
        onChange={(e) =>
          onChange({
            ...value,
            status: e.target.value as "inactive" | "active",
          })
        }
      >
        <option value="inactive">Inactive</option>
        <option value="active">Active</option>
      </select>

      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          disabled={!value.name.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function PlayableCreaturesStep({
  creatures,
  selected,
  onChange,
  onBack,
  onNext,
}: {
  creatures: Creature[];
  selected: string[];
  onChange: (ids: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-purple-100 shadow-sm p-6 space-y-4">
      <p className="text-sm text-gray-500">
        Select the creatures players can use in this campaign.
      </p>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {creatures.map((creature) => (
          <label
            key={creature.id}
            className="flex items-center gap-3 p-2 rounded hover:bg-purple-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(creature.id)}
              onChange={() => toggle(creature.id)}
              className="accent-purple-600"
            />
            <span className="text-gray-800">{creature.name}</span>
          </label>
        ))}

        {creatures.length === 0 && (
          <p className="text-gray-400 text-sm">No creatures available.</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function CampaignStagesStep({
  creatures,
  stages,
  onChange,
  onBack,
  onNext,
}: {
  creatures: Creature[];
  stages: Stage[];
  onChange: (s: Stage[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  function addStage() {
    onChange([...stages, { stageIndex: stages.length + 1, enemyCreatureId: "" }]);
  }

  function updateStage(index: number, enemyCreatureId: string) {
    onChange(
      stages.map((stage, i) =>
        i === index ? { ...stage, enemyCreatureId } : stage
      )
    );
  }

  function removeStage(index: number) {
    onChange(
      stages
        .filter((_, i) => i !== index)
        .map((stage, i) => ({ ...stage, stageIndex: i + 1 }))
    );
  }

  return (
    <div className="bg-white rounded-lg border border-purple-100 shadow-sm p-6 space-y-4">
      <p className="text-sm text-gray-500">
        Define the stages players will fight through.
      </p>

      <div className="space-y-2">
        {stages.map((stage, i) => (
          <div key={i} className="flex gap-3 items-center">
            <span className="text-sm font-medium text-gray-600 w-16 shrink-0">
              Stage {stage.stageIndex}
            </span>

            <select
              className="border border-gray-300 rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={stage.enemyCreatureId}
              onChange={(e) => updateStage(i, e.target.value)}
            >
              <option value="">Select Enemy</option>
              {creatures.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => removeStage(i)}
              className="text-red-500 hover:text-red-700 text-sm px-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addStage}
        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
      >
        + Add Stage
      </button>

      <div className="flex gap-2 justify-end">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
