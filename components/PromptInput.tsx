"use client";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptInput({ value, onChange }: PromptInputProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">3. Add Your Direction (Optional)</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="E.g., 'wearing a blue dress', 'casual outfit', 'professional business attire', 'smiling and confident'..."
        className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
        rows={3}
      />
      <p className="text-xs text-gray-500 mt-2">
        Describe the style, clothing, mood, or pose you want for your photoshoot
      </p>
    </div>
  );
}
