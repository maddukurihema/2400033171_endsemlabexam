import { useState } from "react";

// --- initial branch state ---
const initBranch = () => ({
  courses: [],
  favCourses: [],
  favEvents: [],
  commits: []
});

export default function App() {
  const [branches, setBranches] = useState({ main: initBranch() });
  const [current, setCurrent] = useState("main");
  const [course, setCourse] = useState("");
  const [event, setEvent] = useState("");

  const commit = (msg, newState) => {
    const c = { id: Date.now(), msg, state: newState };
    setBranches(b => ({
      ...b,
      [current]: { ...b[current], ...newState, commits: [...b[current].commits, c] }
    }));
  };

  const addCourse = () => {
    if (!course) return;
    const st = branches[current];
    const updated = { courses: [...st.courses, course] };
    commit("Added course", updated);
    setCourse("");
  };

  const favCourse = (c) => {
    const st = branches[current];
    const updated = { favCourses: [...new Set([...st.favCourses, c])] };
    commit("Favourited course", updated);
  };

  const favEventAdd = () => {
    if (!event) return;
    const st = branches[current];
    const updated = { favEvents: [...new Set([...st.favEvents, event])] };
    commit("Favourited event", updated);
    setEvent("");
  };

  const createBranch = (name) => {
    if (!name) return;
    setBranches(b => ({ ...b, [name]: initBranch() }));
  };

  const merge = (from) => {
    const a = branches[current];
    const b = branches[from];
    const merged = {
      courses: [...new Set([...a.courses, ...b.courses])],
      favCourses: [...new Set([...a.favCourses, ...b.favCourses])],
      favEvents: [...new Set([...a.favEvents, ...b.favEvents])]
    };
    commit(`Merged branch ${from}`, merged);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Branching + Merging Demo</h1>

      <div className="flex gap-2">
        <select value={current} onChange={e => setCurrent(e.target.value)} className="border p-1">
          {Object.keys(branches).map(b => <option key={b}>{b}</option>)}
        </select>
        <input placeholder="new branch" id="bname" className="border p-1" />
        <button className="bg-blue-500 text-white px-2" onClick={() => createBranch(document.getElementById("bname").value)}>Create</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border p-2">
          <h2 className="font-semibold">Courses</h2>
          <div className="flex gap-2 mt-2">
            <input value={course} onChange={e=>setCourse(e.target.value)} className="border p-1" />
            <button className="bg-green-500 text-white px-2" onClick={addCourse}>Add</button>
          </div>
          {branches[current].courses.map(c => (
            <div key={c} className="mt-1 flex justify-between">
              {c}
              <button className="text-sm text-blue-600" onClick={()=>favCourse(c)}>Fav</button>
            </div>
          ))}
        </div>

        <div className="border p-2">
          <h2 className="font-semibold">Events</h2>
          <div className="flex gap-2 mt-2">
            <input value={event} onChange={e=>setEvent(e.target.value)} className="border p-1" />
            <button className="bg-purple-500 text-white px-2" onClick={favEventAdd}>Fav</button>
          </div>
        </div>
      </div>

      <div className="border p-2">
        <h2 className="font-semibold">Merge Branch</h2>
        {Object.keys(branches).filter(b=>b!==current).map(b => (
          <button key={b} className="bg-gray-700 text-white px-2 m-1" onClick={()=>merge(b)}>Merge {b}</button>
        ))}
      </div>

      <div className="border p-2">
        <h2 className="font-semibold">Commit History</h2>
        {branches[current].commits.map(c => (
          <div key={c.id} className="text-sm">• {c.msg}</div>
        ))}
      </div>
    </div>
  );
}