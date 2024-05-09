export const handleCookie = (navigate) => {
  const cookieValue = document.cookie.split(";")[0].trim();
  if (cookieValue != "") {
    const userIdValue = cookieValue.split("=")[1].trim();

    if (userIdValue !== null) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  } else {
    navigate("/login");
  }
};
