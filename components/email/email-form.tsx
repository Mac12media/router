"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EmailForm() {
  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for actual email-sending logic
    console.log("Sending email:", form);
    alert("Email sent (simulated)!");
    // Reset form
    setForm({ to: "", subject: "", body: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="to">To</Label>
        <Input
          id="to"
          name="to"
          type="email"
          placeholder="recipient@example.com"
          value={form.to}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          placeholder="Your subject here"
          value={form.subject}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          name="body"
          placeholder="Write your message..."
          rows={8}
          value={form.body}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit">Start Campaign</Button>
    </form>
  );
}
