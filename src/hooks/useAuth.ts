export function useAuth() {
    const storedUser = localStorage.getItem("user");
  
    if (!storedUser) return null;
  
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      return null;
    }
  }
  