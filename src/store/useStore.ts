import create from "zustand";
import axios from "axios";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
}

interface StoreState {
  tasks: Task[];
  sprints: Sprint[];
  fetchTasks: () => Promise<void>;
  fetchSprints: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addSprint: (sprint: Sprint) => Promise<void>;
  updateSprint: (sprint: Sprint) => Promise<void>;
  deleteSprint: (id: string) => Promise<void>;
  moveTaskToSprint: (task: Task, sprintId: string) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  tasks: [],
  sprints: [],
  fetchTasks: async () => {
    try {
      const response = await axios.get("http://localhost:3000/tasks");
      set({ tasks: response.data });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },
  fetchSprints: async () => {
    try {
      const response = await axios.get("http://localhost:3000/sprints");
      set({ sprints: response.data });
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  },
  addTask: async (task) => {
    try {
      const response = await axios.post("http://localhost:3000/tasks", task);
      set((state) => ({ tasks: [...state.tasks, response.data] }));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  },
  updateTask: async (task) => {
    try {
      await axios.put(`http://localhost:3000/tasks/${task.id}`, task);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
      }));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  },
  deleteTask: async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },
  addSprint: async (sprint) => {
    try {
      const response = await axios.post("http://localhost:3000/sprints", sprint);
      set((state) => ({ sprints: [...state.sprints, response.data] }));
    } catch (error) {
      console.error("Error adding sprint:", error);
    }
  },
  updateSprint: async (sprint) => {
    try {
      await axios.put(`http://localhost:3000/sprints/${sprint.id}`, sprint);
      set((state) => ({
        sprints: state.sprints.map((s) => (s.id === sprint.id ? sprint : s)),
      }));
    } catch (error) {
      console.error("Error updating sprint:", error);
    }
  },
  deleteSprint: async (id) => {
    try {
      await axios.delete(`http://localhost:3000/sprints/${id}`);
      set((state) => ({ sprints: state.sprints.filter((s) => s.id !== id) }));
    } catch (error) {
      console.error("Error deleting sprint:", error);
    }
  },
  moveTaskToSprint: async (task, sprintId) => {
    try {
      // Add the task to the sprint
      const response = await axios.get(`http://localhost:3000/sprints/${sprintId}`);
      const sprint = response.data;
      const updatedSprint = {
        ...sprint,
        tasks: [...sprint.tasks, task],
      };
      await axios.put(`http://localhost:3000/sprints/${sprintId}`, updatedSprint);

      // Update the state
      set((state) => ({
        sprints: state.sprints.map((s) =>
          s.id === sprintId ? updatedSprint : s
        ),
      }));
    } catch (error) {
      console.error("Error moving task to sprint:", error);
    }
  },
}));
