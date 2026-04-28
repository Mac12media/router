"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, CircleAlert, Pencil, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type SubmissionLike = {
  fullName?: string | null;
  email?: string | null;
  position?: string | null;
  classYear?: string | null;
  height?: string | null;
  weight?: string | null;
  videoUrl?: string | null;
  message?: string | null;
};

type ProfileLike = {
  name?: string | null;
  last_name?: string | null;
  email?: string | null;
  sport?: string | null;
  position?: string | null;
  grad_year?: string | null;
  height?: string | null;
  weight?: string | null;
  video?: string | null;
};

type PostProfileSubmitButtonProps = {
  postId: string;
  postTitle: string;
  profile?: ProfileLike | null;
  existingSubmission?: SubmissionLike | null;
  accentTheme?: {
    solidBg: string;
    solidBgHover: string;
    text: string;
  };
};

type FormState = {
  fullName: string;
  email: string;
  position: string;
  classYear: string;
  height: string;
  weight: string;
  videoUrl: string;
  message: string;
};

const REQUIRED_FIELDS: Array<keyof FormState> = [
  "fullName",
  "email",
  "position",
  "classYear",
  "height",
  "weight",
];

const LABELS: Record<keyof FormState, string> = {
  fullName: "Full Name",
  email: "Email",
  position: "Position",
  classYear: "Class",
  height: "Height",
  weight: "Weight",
  videoUrl: "Film Link",
  message: "Message",
};

const POSITIONS_BY_SPORT: Record<string, string[]> = {
  football: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K", "P"],
  basketball_boys: ["PG", "SG", "SF", "PF", "C"],
  basketball_girls: ["PG", "SG", "SF", "PF", "C"],
  girls_flag_football: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K", "P"],
};

const CLASS_OPTIONS = [
  ...Array.from({ length: 8 }, (_, index) => (2025 + index).toString()),
  "Transfer",
];

function toValue(value?: string | null) {
  return value?.trim() ?? "";
}

function formatDisplayValue(label: string, value: string) {
  if (!value) return value;

  if (label !== "Film") return value;

  try {
    const url = new URL(value);
    const path = url.pathname.length > 22 ? `${url.pathname.slice(0, 22)}...` : url.pathname;
    return `${url.hostname}${path}`;
  } catch {
    return value.length > 28 ? `${value.slice(0, 28)}...` : value;
  }
}

function buildInitialState(
  profile?: ProfileLike | null,
  existingSubmission?: SubmissionLike | null
): FormState {
  const fullName = [profile?.name, profile?.last_name].filter(Boolean).join(" ").trim();

  return {
    fullName: toValue(existingSubmission?.fullName) || fullName,
    email: toValue(existingSubmission?.email) || toValue(profile?.email),
    position: toValue(existingSubmission?.position) || toValue(profile?.position),
    classYear: toValue(existingSubmission?.classYear) || toValue(profile?.grad_year),
    height: toValue(existingSubmission?.height) || toValue(profile?.height),
    weight: toValue(existingSubmission?.weight) || toValue(profile?.weight),
    videoUrl: toValue(existingSubmission?.videoUrl) || toValue(profile?.video),
    message: toValue(existingSubmission?.message),
  };
}

function getMissingRequiredFields(form: FormState) {
  return REQUIRED_FIELDS.filter((field) => !form[field].trim());
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  const displayValue = formatDisplayValue(label, value);

  return (
    <div className="grid gap-1 border-b border-zinc-200/80 py-3 last:border-b-0 sm:grid-cols-[140px,minmax(0,1fr)] sm:items-center sm:gap-4 dark:border-white/10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
        {label}
      </p>
      <p
        className={`text-sm font-medium sm:text-right sm:justify-self-end ${
          displayValue ? "text-zinc-950 dark:text-white" : "text-zinc-400 dark:text-zinc-500"
        }`}
      >
        {displayValue || "Not provided"}
      </p>
    </div>
  );
}

function EditableRow({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (name: keyof FormState, value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="grid gap-2 border-b border-zinc-200/80 py-3 last:border-b-0 sm:grid-cols-[140px,minmax(0,1fr)] sm:items-center sm:gap-4 dark:border-white/10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
        {label}
      </p>
      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full border-zinc-200 bg-zinc-50 sm:max-w-[420px] sm:justify-self-end sm:text-right dark:border-white/10 dark:bg-white/[0.03]"
      />
    </div>
  );
}

function EditableSelectRow({
  label,
  value,
  placeholder,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 border-b border-zinc-200/80 py-3 last:border-b-0 sm:grid-cols-[140px,minmax(0,1fr)] sm:items-center sm:gap-4 dark:border-white/10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
        {label}
      </p>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-10 w-full border-zinc-200 bg-zinc-50 sm:max-w-[420px] sm:justify-self-end sm:text-right dark:border-white/10 dark:bg-white/[0.03]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function PostProfileSubmitButton({
  postId,
  postTitle,
  profile,
  existingSubmission,
  accentTheme = {
    solidBg: "bg-orange-500",
    solidBgHover: "hover:bg-orange-600",
    text: "text-orange-500",
  },
}: PostProfileSubmitButtonProps) {
  const initialState = useMemo(
    () => buildInitialState(profile, existingSubmission),
    [profile, existingSubmission]
  );
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(Boolean(existingSubmission));
  const [submitting, setSubmitting] = useState(false);
  const positionOptions = profile?.sport
    ? POSITIONS_BY_SPORT[profile.sport] ?? []
    : [];

  useEffect(() => {
    setForm(initialState);
    setIsEditing(false);
  }, [initialState, open]);

  const missingRequiredFields = getMissingRequiredFields(form);
  const isReadyToSend = missingRequiredFields.length === 0;
  const missingFieldLabel =
    missingRequiredFields.length > 0
      ? missingRequiredFields.map((field) => LABELS[field]).join(", ")
      : "";
  const requiresEditsBeforeSubmit = !isReadyToSend;
  const primaryButtonLabel = success
    ? "Update Submission"
    : requiresEditsBeforeSubmit
      ? isEditing
        ? "Complete Required Fields"
        : "Edit Profile Details"
      : "Send Profile";

  function updateField(name: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/posts/${postId}/submit-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || "Failed to submit profile");
        return;
      }

      setSuccess(true);
      setOpen(false);
    } catch {
      setError("Failed to submit profile");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className={
            success
              ? "rounded-full border border-emerald-200 bg-emerald-50 px-4 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-400"
              : `rounded-full px-4 text-white ${accentTheme.solidBg} ${accentTheme.solidBgHover}`
          }
        >
          {success ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Submitted
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Profile
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-3xl overflow-hidden border-zinc-200 bg-white p-0 dark:border-white/10 dark:bg-zinc-950 sm:w-full">
        <DialogHeader className="border-b border-zinc-200/80 px-4 pb-4 pt-5 sm:px-5 dark:border-white/10">
          <DialogTitle className="text-2xl font-bold tracking-[-0.03em] text-zinc-950 dark:text-white">
            Send Profile
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {postTitle}
          </DialogDescription>
        </DialogHeader>

        <form className="flex max-h-[calc(92vh-90px)] flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 sm:px-5 sm:pb-8">
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center gap-2 text-sm">
                {isReadyToSend ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium text-zinc-950 dark:text-white">
                      Ready to send
                    </span>
                  </>
                ) : (
                  <>
                    <CircleAlert className={`h-4 w-4 ${accentTheme.text}`} />
                    <span className="font-medium text-zinc-950 dark:text-white">
                      Missing {missingFieldLabel.toLowerCase()}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-2 dark:border-white/10 dark:bg-white/[0.02]">
              {isEditing ? (
                <>
                  <EditableRow
                    label="Full Name"
                    name="fullName"
                    value={form.fullName}
                    onChange={updateField}
                    placeholder="Athlete name"
                  />
                  <EditableRow
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="name@email.com"
                  />
                  <EditableSelectRow
                    label="Position"
                    value={form.position}
                    onValueChange={(value) => updateField("position", value)}
                    placeholder="Select position"
                    options={positionOptions}
                  />
                  <EditableSelectRow
                    label="Class"
                    value={form.classYear}
                    onValueChange={(value) => updateField("classYear", value)}
                    placeholder="Select class"
                    options={CLASS_OPTIONS}
                  />
                  <EditableRow
                    label="Height"
                    name="height"
                    value={form.height}
                    onChange={updateField}
                    placeholder="6'2"
                  />
                  <EditableRow
                    label="Weight"
                    name="weight"
                    value={form.weight}
                    onChange={updateField}
                    placeholder="185"
                  />
                  <EditableRow
                    label="Film"
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={updateField}
                    placeholder="https://..."
                  />
                  <div className="border-b border-zinc-200/80 py-3 last:border-b-0 dark:border-white/10">
                    <div className="grid gap-2 sm:grid-cols-[140px,minmax(0,1fr)] sm:items-start sm:gap-4">
                      <p className="pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
                        Message
                      </p>
                      <Textarea
                        value={form.message}
                        onChange={(event) => updateField("message", event.target.value)}
                        placeholder="Optional note"
                        className="min-h-[110px] w-full border-zinc-200 bg-zinc-50 sm:max-w-[420px] sm:justify-self-end sm:text-right dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <SummaryRow label="Full Name" value={form.fullName} />
                  <SummaryRow label="Email" value={form.email} />
                  <SummaryRow label="Position" value={form.position} />
                  <SummaryRow label="Class" value={form.classYear} />
                  <SummaryRow label="Height" value={form.height} />
                  <SummaryRow label="Weight" value={form.weight} />
                  <SummaryRow label="Film" value={form.videoUrl} />
                </>
              )}
            </div>

            <Collapsible open={isEditing} onOpenChange={setIsEditing}>
              <div className="mt-3">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-2 text-sm font-medium transition ${accentTheme.text}`}
                  >
                    <Pencil className="h-4 w-4" />
                    {isEditing ? "Hide edit" : "Edit details"}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isEditing ? "rotate-180" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>
            </Collapsible>

            {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
          </div>

          <DialogFooter className="sticky bottom-0 z-10 border-t border-zinc-200/80 bg-white px-4 py-4 sm:px-5 dark:border-white/10 dark:bg-zinc-950">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {isReadyToSend
                  ? "Looks good."
                  : isEditing
                    ? "Complete the missing fields to submit."
                    : "Review your profile first. You’ll need to edit missing details before submitting."}
              </p>
              <Button
                type={requiresEditsBeforeSubmit ? "button" : "submit"}
                loading={submitting}
                className={`h-10 w-full rounded-full px-5 text-white sm:w-auto ${accentTheme.solidBg} ${accentTheme.solidBgHover}`}
                onClick={
                  requiresEditsBeforeSubmit
                    ? () => setIsEditing(true)
                    : undefined
                }
              >
                {primaryButtonLabel}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
