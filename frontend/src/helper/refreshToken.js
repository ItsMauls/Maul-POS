const RefreshToken = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
        },
      }
    );

    if (!response.ok) {
      localStorage.clear();
      window.location.href = "/login";
      return false;
    }

    const data = await response.json();

    localStorage.setItem("user", JSON.stringify(data.data.user));
    localStorage.setItem("access_token", data.data.access_token);
    localStorage.setItem("refresh_token", data.data.refresh_token);

    return true;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
};

export default RefreshToken;