"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar, Clipboard, CheckCircle2 } from "lucide-react";

interface Note {
  id: number;
  title: string;
  body: string;
  date: string;
  category: "alert" | "routine" | "critical";
}

export default function AdminNotes() {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: "Evacuation Route Clearance", body: "Check progress of Highway 5 flood cleaning crew. Confirm heavy earthmovers have arrived at Sector 4 bypass.", date: "8/28/2026", category: "critical" },
    { id: 2, title: "Satellite Sync Cycle", body: "Routine satellite communication sync scheduled at 04:00 AM. Ensure backup diesel generator at district node has sufficient fuel.", date: "8/28/2026", category: "routine" },
    { id: 3, title: "Emergency Medical Buffers", body: "Odisha Health Board dispatched 500 extra first-aid kits to Bhubaneswar center. Verification confirmation pending.", date: "8/27/2026", category: "alert" }
  ]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<"alert" | "routine" | "critical">("routine");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const newNote: Note = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      date: new Date().toLocaleDateString(),
      category
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setBody("");
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl w-full mx-auto animate-[fadeIn_0.5s_ease-out]">
      {/* Create Note Column */}
      <div className="lg:col-span-1">
        <form onSubmit={handleAddNote} className="neu-flat p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-green-200/55 pb-3">
            <div className="p-2.5 rounded-xl neu-sunken text-emerald-600">
              <Clipboard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Operational Notes</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Post Directives</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Note Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Helicopter Landing Check"
              className="w-full rounded-xl neu-sunken py-2.5 px-4 text-xs text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Memos / Directives</label>
            <textarea
              required
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Post directive details here..."
              className="w-full rounded-xl neu-sunken py-2.5 px-4 text-xs text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Severity</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full rounded-xl neu-sunken py-2.5 px-3 text-xs text-white outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 bg-slate-900 cursor-pointer text-center font-bold"
            >
              <option value="routine" className="bg-slate-950 text-slate-100">Routine Directive</option>
              <option value="alert" className="bg-slate-950 text-slate-100">Escalated Notice</option>
              <option value="critical" className="bg-slate-950 text-slate-100">Critical Priority</option>
            </select>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl neu-green-flat py-3 text-xs font-bold text-white uppercase tracking-wider cursor-pointer mt-2"
          >
            <Plus className="h-4 w-4" />
            <span>Broadcast Note</span>
          </button>
        </form>
      </div>

      {/* Broadcast Memos Feed List */}
      <div className="lg:col-span-2 space-y-6">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="neu-flat p-6 rounded-3xl relative flex flex-col justify-between min-h-[160px] group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    note.category === "critical" ? "bg-red-500/10 text-red-700 font-extrabold" :
                    note.category === "alert" ? "bg-amber-500/10 text-amber-700" : "bg-emerald-500/10 text-emerald-700"
                  }`}>
                    {note.category}
                  </span>
                  
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                      <Calendar className="h-3.5 w-3.5" /> {note.date}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-xl cursor-pointer neu-flat hover:shadow-[3px_3px_6px_#c5d5c6,_inset_-3px_-3px_6px_#ffffff]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h4 className="text-base font-black text-slate-800 uppercase tracking-wide leading-snug">{note.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2.5">{note.body}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="neu-flat p-12 rounded-3xl flex flex-col items-center justify-center text-center text-slate-400 py-16 gap-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">No active bulletins</h4>
            <p className="text-xs max-w-xs mx-auto">Create a directive on the left board to broadcast active tasks to the coordinating units.</p>
          </div>
        )}
      </div>
    </div>
  );
}
