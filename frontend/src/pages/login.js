import MainContainer from "@/components/MainContainer";
import isLoggedIn from "@/helper/isLoggedIn";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Form, Icon, Message } from "semantic-ui-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [login, setLogin] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      console.log("login");
      //dialog to message if user already login
      //   router.push("/");
      setLogin(true);
    }

    console.log("not login");
  }, []);

  const changeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const submit = () => {
    setLoading(true);
    setError("");

    attemptLogin();
  };

  const attemptLogin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      const data = await res.json();
      if (data.status_code !== 200) {
        throw new Error(data.message);
      }

      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("refresh_token", data.data.refresh_token);

      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    } catch (error) {
      console.log(error);
    }

    localStorage.clear();
    setLogin(false);
  };

  return (
    <div className="main-login-background container">
      <Head>
        <title>login - {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>

      <main className="main">
        {login && (
          <Card fluid>
            <Card.Content>
              <Message
                success
                header="You already login"
                content="You will be redirected to the homepage"
              />

              <Button primary onClick={() => router.push("/")}>
                <Icon name="home" />
                Go to Homepage
              </Button>

              <Button
                onClick={() => {
                    handleLogout();
                }}
              >
                <Icon name="sign-out" />
                Logout
              </Button>
            </Card.Content>
          </Card>
        )}

        {!login && (
          <div>
            <h1>Apotek PBF</h1>
            <Card fluid className={login ? "blurred" : ""}>
              <Card.Content>
                <Form size={"big"} style={{ textAlign: "center" }}>
                  <br />
                  <Form.Field>
                    <label>Username</label>
                    <input
                      placeholder="Username"
                      name="username"
                      style={{ minWidth: "100%", maxWidth: "350px" }}
                      onChange={changeInput}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      style={{ minWidth: "100%", maxWidth: "350px" }}
                      onChange={changeInput}
                    />
                  </Form.Field>
                  <Button
                    type="submit"
                    primary
                    onClick={submit}
                    disabled={
                      loading ? true : username && password ? false : true
                    }
                    loading={loading}
                  >
                    <Icon name="sign-in" />
                    Login
                  </Button>
                  <br />
                  <br />

                  {error && (
                    <div className="ui negative message">
                      <i
                        className="close icon"
                        onClick={() => setError("")}
                      ></i>
                      <div className="header">Error</div>
                      <p>{error}</p>
                    </div>
                  )}
                </Form>
              </Card.Content>
            </Card>
            <div
              style={{
                fontStyle: "italic",
                width: "100%",
                textAlign: "center",
                marginTop: "-10px",
                color: "black",
              }}
            >
              by <b>Pesulap Merah</b>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Login;
