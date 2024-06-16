export const logout = () => {
  sessionStorage.clear();
  localStorage.removeItem("persist:root");
  localStorage.clear();

  window.location.href = `${import.meta.env.VITE_WEB_URL}/sign-in`;
};
