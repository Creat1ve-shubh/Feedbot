"use client";

interface PostRow {
  id: string;
  text: string;
  sentiment: string;
  summary?: string;
  platform?: string;
  created_at?: string;
}

export default function PostTable({ data }: { data: PostRow[] }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-3">Posts</h3>
      <div className="max-h-96 overflow-y-auto text-sm divide-y">
        {data.map((row) => (
          <div key={row.id} className="py-3">
            <p className="mb-1 font-medium">{row.text}</p>
            <p className="text-xs text-gray-500 flex gap-2 flex-wrap">
              <span>{row.sentiment}</span>
              {row.summary && <span className="italic">{row.summary}</span>}
              {row.platform && <span>{row.platform}</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
